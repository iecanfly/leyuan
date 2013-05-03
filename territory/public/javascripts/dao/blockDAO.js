Territory.DAO.Block = Class.extend({
	_territoryMap : null,
	
	init : function(map) {
		this._territoryMap = map;
	},
	
	saveBlock : function(cong, block, number, recommendedWorkerNum, coord) {
		var me = this;
		$.ajax({
			  type: "POST",
			  url: "/blocks",
			  data: {cong: cong , block: block, number: number, recommendedWorkerNum: recommendedWorkerNum, coord: coord }
			}).done(function(msg) {
				if(msg.status === "OK") {
					me.getAllBlocks(cong);
				} else {
					alert(msg.message);
				}
				
			});
		
	},
	
	updateBlock : function(block) {
		var me = this;
		$.ajax({
			  type: "POST",
			  url: "/block/update",
			  data: {id: block.id, cong: cong, block: block.block, number: block.number, recommendedWorkerNum: block.recommendedWorkerNum, coord: block.coord }
			}).done(function(msg) {
				if(msg.status === "OK") {
					me.getAllBlocks(cong);
				} 
					
				alert(msg.message);
			});
		
	},
	
	getAllBlocks : function(cong) {
		$.ajax({
			  url: "/blocks/" + cong
			}).done(function(msg) {
				_territoryMap.drawBlocks(msg.data);
			});
	},
	
	getBlocks : function(cong, block) {
		$.ajax({
			  url: "/blocks/" + cong + "/" + block
			}).done(function(msg) {
				_territoryMap.drawBlocks(msg.data);
			});
	},
	
	deleteBlock : function(cong, block) {
		var me = this;
		$.ajax({
			  url: "/blocks/delete/" + cong + "/" + block
			}).done(function(msg) {
				me.getAllBlocks(cong);
			});
	}
	
});