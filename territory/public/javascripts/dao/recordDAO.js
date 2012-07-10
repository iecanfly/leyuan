Territory.DAO.Record = Class.extend({
	_territoryMap : null,
	
	init : function(map) {
		_territoryMap = map;
	},
	
	saveRecord : function(record) {
		$.ajax({
			  type: "POST",
			  url: "/record",
			  data: { cong: record["cong"] , 
				  	  block: record["block"], 
				  	  number: record["number"],  
				  	  workDate: record["workDate"], 
				  	  initial: record["initial"] }
			}).done(function(msg) {
				alert(msg.message);
			});
	},
	
	returnCard : function(record) {
		$.ajax({
			  type: "POST",
			  url: "/record/return",
			  data: { cong: record["cong"] , 
				  	  block: record["block"], 
				  	  number: record["number"], 
				  	  workDate: record["workDate"], 
				  	  initial: record["initial"], 
				  	  returnDate: record["returnDate"] }
			}).done(function(msg) {
				alert(msg.message);
			});
	},
	
	getBlockRecords : function(cong, block) {
		console.log(block);
		$.ajax({
			  url: "/record/" + cong + "/" + block
			}).done(function(result) {
				_territoryMap.showRecords(result.data);
			});
	},
	
});