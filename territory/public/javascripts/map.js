var Territory = Territory || {};
Territory.DAO = {};

Territory.Map = Class.extend({
	_this : null,
	_map : null,
	_myDis : null,
	_blockDAO : null,
	_recordDAO : null,
	_congDAO : null,
	_dialogue : null,
	_cong : null,
	_blocks : null,
	_currentBlock : null,

	init : function() {
		_this = this;
		_cong = cong;
		_map = new BMap.Map("container", {enableHighResolution : true});
		_map.addControl(new BMap.ScaleControl());
		_map.addControl(new BMap.NavigationControl());
		_map.addControl(new BMap.OverviewMapControl());
		_map.addControl(new BMap.MapTypeControl());
		_map.enableScrollWheelZoom();
		_myDis = new BMapLib.DistanceTool(_map);
		
		_blockDAO = new Territory.DAO.Block(_this);
		_recordDAO = new Territory.DAO.Record(_this);
		_congDAO = new Territory.DAO.Cong(_this);
		_dialogue = new Territory.Dialogue(_cong, _this);
		_myDis.addEventListener("drawend", function(e) {
			_this._openSaveBlockDialogue(e.points);
		});

		_this._init();
		
	},
	
	_initViewFilterCombo : function(blocks) {
		var uniqueBlockNames = this._getUniqueBlockNames(blocks);
		$("#cboViewFilter").html("");
		$("#cboViewFilter").unbind("change");
		$("#cboViewFilter").on("change", function(){ _this._filterBlocks(this.value); });
		var options = $("#viewFilterOptionTmpl").html().replace(/{val}/gi, "").replace(/{name}/gi, "View All");
		
		for(var i = 0; i < uniqueBlockNames.length; i++) {
			options = options + $("#viewFilterOptionTmpl").html().replace(/{val}/gi, uniqueBlockNames[i]).replace(/{name}/gi, uniqueBlockNames[i]);
		}
		
		$("#cboViewFilter").html(options);
	},
	

	saveBlock : function(block, number, pts) {
		var coord = "";
		for ( var i = 0; i < pts.length; i++) {
			coord = coord.concat(pts[i]["lat"]  + "," + pts[i]["lng"] );
			if (i !== pts.length - 1) {
				coord = coord.concat(";");
			}
		}
		_blockDAO.saveBlock(_cong, block,number, coord);
	},

	_openSaveBlockDialogue : function(pts) {
		_dialogue.openSaveBlockDialogue(pts);
	},
	
	openBlockViewCoverage : function() {
		window.open("/coverage/blockView/" + _cong + "/" + $("#coverageFromDate").val());
	},
	
	openChartViewCoverage : function() {
		window.open("/coverage/chartView/" + _cong + "/" + $("#coverageFromDate").val());
	},
	
	openPrintDialogue : function() {
		_dialogue.openPrintDialogue(_blocks);
	},

	startDrawingBlocks : function() {
		_myDis.open();
	},

	finishDrawingBlocks : function() {
		_myDis.close();
	},

	_init : function() {
		_congDAO.getCong(_cong);
		_blockDAO.getAllBlocks(_cong);
		$("#coverageFromDate").datepicker();
		$("#coverageFromDate").datepicker("option", "dateFormat", "yy-mm-dd" );
	},
	
	centerAndZoom : function(cong) {
		var lat = cong.centerCoord.split(",")[0];
		var lng = cong.centerCoord.split(",")[1];
		_map.centerAndZoom(new BMap.Point(parseFloat(lng), parseFloat(lat)), parseInt(cong.zoomLevel));
	},
	
	_filterBlocks : function(blockName) {
		if(blockName === "") {
			_this._init();
		} else {
			_map.clearOverlays();
			var centerPoint;
			var appendedCoord = "";
			
			for (var i = 0; i < _blocks.length; i++) {
				var block = _blocks[i];
				if(block.block === blockName) {
					_this.drawBlock(block.block, block.number, block.coord);
					appendedCoord = appendedCoord + block.coord;
				}
			}
			
			centerPoint = _this._findMarkerPosition(appendedCoord);
			_map.centerAndZoom(new BMap.Point(centerPoint[0], centerPoint[1]), _map.getZoom());
		}
	},

	drawBlocks : function(data) {
		_blocks = data;
		_map.clearOverlays();
		
		for ( var i = 0; i < _blocks.length; i++) {
			var block = _blocks[i];
			_this.drawBlock(block.block, block.number, block.coord);
		}
		
		// After drawing new blocks, update the view filter
		_this._initViewFilterCombo(_blocks);
	},

	drawBlock : function(block, number, pts) {
		var pointStrArray = pts.split(";");
		var pointArray = [];

		for ( var i = 0; i < pointStrArray.length; i++) {
			var point = new BMap.Point(pointStrArray[i].split(",")[1], pointStrArray[i].split(",")[0]);
			pointArray.push(point);
		}

		_this._drawPolygon(pointArray);
		_this._drawBlockMarker(block, number, pts);

	},

	_drawPolygon : function(pts) {
		var ply = new BMap.Polygon(pts);
		_map.addOverlay(ply);
	},
	
	showRecords : function(data) {
		_dialogue.openViewRecordDialogue(data);
	},

	_getMarkerContextMenu : function() {
		var contextMenu = new BMap.ContextMenu();
		var txtMenuItem = [];
		txtMenuItem["writeRecord"] = { 
			text : 'Write Record',
			callback : function() {
				_dialogue.openSaveRecordDialogue(_currentBlock);
			}
		};
		
		txtMenuItem["returnCard"] = { 
				text : 'Return Card',
				callback : function() {
					_dialogue.openReturnCardDialogue(_currentBlock);
				}
		};
		
		txtMenuItem["viewRecord"] = {
			text : 'View record',
			callback : function() {
				_recordDAO.getBlockRecords(_cong, _currentBlock);
			}
		};
		
		txtMenuItem["deleteBlock"] = {
			text : 'Delete Block',
			callback : function() {
				if(confirm("Are you sure you want to Delete?")) {
					_blockDAO.deleteBlock(_cong, _currentBlock);
				}
			}
		};

		contextMenu.addItem(new BMap.MenuItem(txtMenuItem["writeRecord"].text, txtMenuItem["writeRecord"].callback, 100));
		contextMenu.addItem(new BMap.MenuItem(txtMenuItem["returnCard"].text, txtMenuItem["returnCard"].callback, 100));
		contextMenu.addItem(new BMap.MenuItem(txtMenuItem["viewRecord"].text, txtMenuItem["viewRecord"].callback, 100));
		contextMenu.addSeparator();
		contextMenu.addItem(new BMap.MenuItem(txtMenuItem["deleteBlock"].text, txtMenuItem["deleteBlock"].callback, 100));

		return contextMenu;
	},

	saveWorkRecord : function(record) {
		_recordDAO.saveRecord(record);
	},
	
	returnCard : function(record) {
		_recordDAO.returnCard(record);
	},

	_drawBlockMarker : function(block, number, pts) {
		var markerPosition = _this._findMarkerPosition(pts);
		var icon = new BMap.Icon("/assets/images/red_marker.png", new BMap.Size(14,23))
		var mkr = new BMap.Marker(new BMap.Point(markerPosition[0],	markerPosition[1]));
		mkr.addContextMenu(_this._getMarkerContextMenu());
		mkr.addEventListener("rightclick", function() {
			_currentBlock = this._config.label.content;
		})
		mkr.setIcon(icon);

		var lbl = new BMap.Label(block + "-" + number, { offset : new BMap.Size(20, 1) });
		lbl.setStyle({ border : "solid 1px gray" });
		mkr.setLabel(lbl);
		mkr.setTitle("Block : " + block + "- " + number);
		_map.addOverlay(mkr);
	},

	_findMarkerPosition : function(pts) {
		var pointStrArray = pts.split(";");
		var latAvg = 0.0;
		var lngAvg = 0.0;

		for ( var i = 0; i < pointStrArray.length; i++) {
			latAvg += parseFloat(pointStrArray[i].split(",")[1]);
			lngAvg += parseFloat(pointStrArray[i].split(",")[0]);
		}

		latAvg /= parseFloat(pointStrArray.length);
		lngAvg /= parseFloat(pointStrArray.length);

		return [ latAvg, lngAvg ];
	},
	
	_getUniqueBlockNames : function(blocks) {
		var currentBlock = "";
		var blockNameArray = [];
		for(var i = 0; i < blocks.length; i++) {
			if(currentBlock != blocks[i].block) {
				blockNameArray.push(blocks[i].block);
			}
			
			currentBlock = blocks[i].block;
		}
		
		return blockNameArray;
	}

});
