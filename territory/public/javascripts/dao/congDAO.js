Territory.DAO.Cong = Class.extend({
	_territoryMap : null,
	
	init : function(map) {
		_territoryMap = map;
	},
	
	saveCong : function(cong) {
		$.ajax({
			  type: "POST",
			  url: "/cong",
			  data: { name: cong["name"] , 
				  	  centerCoord: cong["centerCoord"], 
				  	  zoomLevel: cong["zoomLevel"] }  
			}).done(function(msg) {
				alert(msg.message);
				_territoryMap.refresh();
			});
	},
	
	getCong : function(cong) {
		$.ajax({
			  url: "/cong/" + cong
			}).done(function(msg) {
				_territoryMap.centerAndZoom(msg.data);
			});
	}
	
	
});