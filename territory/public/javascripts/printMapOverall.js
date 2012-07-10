var Territory = Territory || {};
Territory.DAO = {};

Territory.PrintMapOverall = Class.extend({
	_this : null,
	_map : null,
	_centerPoint : null,
	_myDis : null,
	_blockDAO : null,
	_blockInfo : null,
	_defaultZoomLevel : null,
	
	init: function(blockInfo){
		_this = this;
		_defaultZoomLevel = 17;
		_blockInfo = blockInfo;
		_centerPoint = new BMap.Point(_this.getCentreCoord()[0], _this.getCentreCoord()[1]);
		_map = new BMap.Map("printContainer");
		_map.addControl(new BMap.ScaleControl()); 
		_map.centerAndZoom(_centerPoint, _this.getPrintZoomLevel());
		_map.enableScrollWheelZoom();
		_this.drawBlock(blockInfo["blockName"], blockInfo["blockNumber"], blockInfo["coord"]);
		_this._drawBlockMarker(blockInfo["blockName"], blockInfo["blockNumber"], blockInfo["coord"]);
	},
	
	getCentreCoord : function() {
		var centreCoord;
		
		if(_blockInfo["printCoord"] != "") {
			centreCoord = [blockInfo["printCoord"].split(",")[1], _blockInfo["printCoord"].split(",")[0]];  
		} else if(_blockInfo["markerCoord"] != ""){
			centreCoord = [blockInfo["markerCoord"].split(",")[1], _blockInfo["markerCoord"].split(",")[0]];  
		} else {
			centreCoord = _this._findMarkerPosition(_blockInfo["coord"]);
		}
		
		return centreCoord;
	},
	
	getPrintZoomLevel : function() {
		if(_blockInfo["printZoomLevel"] != "") {
			return _blockInfo["printZoomLevel"];
		}
		
		return _defaultZoomLevel;
	},
	
	drawBlock : function(block, number, pts) {
		var pointStrArray = pts.split(";");
		var pointArray = [];
		
		for(var i = 0; i < pointStrArray.length; i++) {
			var point = new BMap.Point(pointStrArray[i].split(",")[1], pointStrArray[i].split(",")[0]);
			pointArray.push(point);
		}
		
		_this._drawPolygon(pointArray);
	},
	
	_drawPolygon : function(pts){
		var ply = new BMap.Polygon(pts, { strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.6, fillOpacity: 0.000001 });    
	    _map.addOverlay(ply);  
	},
	
	_drawBlockMarker : function(block, number, pts) {
		var markerPosition = _this._findMarkerPosition(pts);
		var mkr = new BMap.Marker(new BMap.Point(markerPosition[0], markerPosition[1]));
		var title = "Block : " + block + "- "+ number;
		mkr.setTitle(title); 
		_map.addOverlay(mkr);
	},
	
	_findMarkerPosition : function(pts) {
		var pointStrArray = pts.split(";");
		var latAvg = 0.0;
		var lngAvg = 0.0;
		
		for(var i = 0; i < pointStrArray.length; i++) {
			latAvg += parseFloat(pointStrArray[i].split(",")[1]);
			lngAvg += parseFloat(pointStrArray[i].split(",")[0]);
		}
		
		latAvg /= parseFloat(pointStrArray.length);
		lngAvg /= parseFloat(pointStrArray.length);
		
		return [latAvg, lngAvg];
	},
	
	_getDistanceFromCenterMarker : function(poi) {
		 var p1 = new LatLon(_centerPoint.lat, _centerPoint.lng);   
		 var p2 = new LatLon(poi.point.lat, poi.point.lng);     
		 return p1.distanceTo(p2) * 1000;   
	}
	
});






