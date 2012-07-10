Territory.DAO.Coverage = Class.extend({
	_coverage : null,
	
	init : function(coverage) {
		_coverage = coverage;
	},
	
	getCoverage : function(cong, date) {
		$.ajax({
			  url: "/coverage/" + cong + "/" + date
			}).done(function(msg) {
				_coverage.displayCoverage(msg.data);
			});
	}
	
});