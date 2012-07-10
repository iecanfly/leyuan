var Territory = Territory || {};
Territory.DAO = {};

Territory.NewCong = Class.extend({
	_this : null,
	_map : null,
	_cong : null,
	_congDAO : null,

	init : function() {
		_this = this;
		_cong = cong;
		_congDAO = new Territory.DAO.Cong(this);
		_map = new BMap.Map("firstContainer", {enableHighResolution : true});
		_map.addControl(new BMap.ScaleControl());
		_map.addControl(new BMap.OverviewMapControl());
		_map.addControl(new BMap.MapTypeControl());
		_map.centerAndZoom(new BMap.Point(105.561739, 35.821825), 5);
		_map.enableScrollWheelZoom();
		_map.addEventListener("moving", function(e) {
			$("#inputLat").val(e.currentTarget.centerPoint.lat);
			$("#inputLng").val(e.currentTarget.centerPoint.lng);
		});
		
		_map.addEventListener("zoomend", function(e) {
			$("#inputZoom").val(e.currentTarget.zoomLevel);
			$("#inputLat").val(e.currentTarget.centerPoint.lat);
			$("#inputLng").val(e.currentTarget.centerPoint.lng);
		});
		
		$("#inputLat").val(_map.getCenter().lat);
		$("#inputLng").val(_map.getCenter().lng);
		$("#inputZoom").val(_map.getZoom());
	},
	
	saveCong : function() {
		var cong = [];
		cong["name"] = _cong;
		cong["centerCoord"] = _map.getCenter().lat + "," + _map.getCenter().lng;
		cong["zoomLevel"] = _map.getZoom();
		_congDAO.saveCong(cong);
	},
	
	refresh : function() {
		window.location.reload();
	}

});
