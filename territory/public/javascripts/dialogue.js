Territory.Dialogue = Class.extend({
	_territoryMap : null,
	_pts : null,
	_currentBlock : null,
	_cong : null,
	_recordTable : null,
	_members : [
	            "XW", "JY", "ZQM", "SH", "WLC", "WL", "YAJ"
	            ],
	
	
	init : function(cong, map) {
		_territoryMap = map;
		_cong = cong;
		this._prepareSaveBlockDialogue();
		this._prepareWriteRecordDialogue();
		this._prepareViewRecordDialogue();
		
	},
	
	_prepareSaveBlockDialogue : function() {
		$("#save_block_dialog_form").dialog({
			autoOpen: false,
			height: 230,
			width: 250,
			modal: true,
			buttons: {
				"Create a block": function() {
					var block = $("#block").val();
					var number = $("#number").val();
					_territoryMap.saveBlock(block, number, _pts);
					$(this).dialog("close");
					
				},
				Cancel: function() {
					$(this).dialog("close");
				}
			}
		});
	},
	
	_prepareWriteRecordDialogue : function() {
		$("#save_record_dialog_form").dialog({
			autoOpen: false,
			height: 250,
			width: 250,
			modal: true,
			buttons: {
				"Save": function() {
					var record = [];
					record["cong"] = _cong;
					record["block"] = _currentBlock.split("-")[0];
					record["number"] = _currentBlock.split("-")[1];
					record["workDate"] = $("#workDate").val();
					record["initial"] = $("#initial").val();
					_territoryMap.saveWorkRecord(record);
					$(this).dialog("close");
				},
				Cancel: function() {
					$(this).dialog("close");
				}
			}
		});
		
		$("#return_card_dialog_form").dialog({
			autoOpen: false,
			height: 180,
			width: 250,
			modal: true,
			buttons: {
				"Save": function() {
					var record = [];
					record["cong"] = _cong;
					record["block"] = _currentBlock.split("-")[0];
					record["number"] = _currentBlock.split("-")[1];
					record["workDate"] = "2012-12-12"; //dummy data
					record["initial"] = "dummy"; //dummy data
					record["returnDate"] = $("#returnDate").val();
					_territoryMap.returnCard(record);
					$(this).dialog("close");
				},
				Cancel: function() {
					$(this).dialog("close");
				}
			}
		});
		
		$("#workDate").datepicker();
		$("#returnDate").datepicker();
		$("#workDate").datepicker( "option", "showAnim", "drop");
		$("#workDate").datepicker( "option", "dateFormat", "yy-mm-dd" );
		$("#returnDate").datepicker( "option", "showAnim", "drop");
		$("#returnDate").datepicker( "option", "dateFormat", "yy-mm-dd" );
		$( "#initial" ).autocomplete({ source : this._members});
	},
	
	_prepareViewRecordDialogue : function() {
		_recordTable = $("#view_record_dialog").dialog({
			autoOpen: false,
			height: 430,
			width: 500,
			modal: true,
			buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
				}
			}
		});
		
		
	},
	
	_preparePrintDialogue : function() {
		$("#print_dialog_form").dialog({
			autoOpen: false,
			height: 400,
			width: 600,
			modal: true,
			buttons: {
				"Print territory": function() {
					var blocks = [];
					$("form .printcheck:checked").each(function(){
						if($(this).attr("id") != "printAll") {
							blocks.push($(this).attr("id"));
						}
					});
					
					window.open("/print/" + _cong + "/" + blocks.join(",") + ",");
					$(this).dialog("close");
				},
				Cancel: function() {
					$(this).dialog("close");
				}
			}
		});
		
		$(document).on("click", "#printAll", function () {
			if($(this).is(":checked")) {
				$(".printcheck").attr("checked", true);
			} else {
				$(".printcheck").attr("checked", false);
			}   	
	    });
	},
	
	openSaveBlockDialogue : function(pts) {
		$("#save_block_dialog_form").dialog("open");
		_pts = pts;
	},
	
	openSaveRecordDialogue : function(block) {
		_currentBlock = block;
		$("#save_record_dialog_form").dialog("open");
	},
	
	openReturnCardDialogue : function(block) {
		_currentBlock = block;
		$("#return_card_dialog_form").dialog("open");
	},
	
	openViewRecordDialogue : function(data) {
		if(_this._recordTable) {
			_this._recordTable.fnClearTable();
			_this._recordTable.fnAddData(data);
		} else {
			_this._recordTable = $('#record').dataTable({
				"bJQueryUI" : true,
				"bRetrieve" : true,
				"bFilter": false,
				"bLengthChange": false,
				"bSort": false,
				"sAjaxDataProp" : "",
				"aaData": data,
				"aoColumns": [
					{ "sTitle" : "Work Date", "mDataProp": "workDate" },
					{ "sTitle" : "Card Return Date", "mDataProp": "returnDate" },
					{ "sTitle" : "Worked By", "mDataProp": "initial" }
				]
			});
		}
		
		$("#view_record_dialog").dialog("open");
	},
	
	openPrintDialogue : function(_blocks) {
		var printAllTempl = $("#printAllTempl").html();
		var headerTempl = $("#printHeaderTempl").html();
		var checkboxTempl = $("#printCheckTempl").html();
		
		$("#printFieldSet").html("");
		$("#printFieldSet").append(printAllTempl);
		var uniqueBlockNames = this._getUniqueBlockNames(_blocks);
		var printHtml = "";
		
		for(var i = 0; i < uniqueBlockNames.length; i++) {
			printHtml += "<div class=\"printBlockDiv\">";
			printHtml += headerTempl.replace(/{blockName}/gi, uniqueBlockNames[i]);
			
			for(var j = 0; j < _blocks.length; j++) {
				if(uniqueBlockNames[i] == _blocks[j].block) {
					printHtml += "<div class=\"printBlockUnit\">" + checkboxTempl.replace(/{block}/gi, uniqueBlockNames[i] + "-" + _blocks[j].number) + "</div>";
				}
			}
			
			printHtml += "</div>";
		}
		
		$("#printFieldSet").append(printHtml);
		
		this._preparePrintDialogue();
		$("#print_dialog_form").dialog("open");
	},
	
	_getUniqueBlockNames : function(_blocks) {
		var currentBlock = "";
		var blockNameArray = [];
		for(var i = 0; i < _blocks.length; i++) {
			if(currentBlock != _blocks[i].block) {
				blockNameArray.push(_blocks[i].block);
			}
			
			currentBlock = _blocks[i].block;
		}
		
		return blockNameArray;
	}
	
});