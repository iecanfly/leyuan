var Territory = Territory || {};
Territory.DAO = {};
Territory.Coverage = {};

Territory.Coverage.Chart = Class.extend({
	_this : null,
	_cong : null, 
	_coverageDAO : null,
	_coverageTable : null,
	
	init : function(cong){
		_this = this;
		_cong = cong;
	},
	
	createChart : function(blockItemList, blockItemCoverList) {
		new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'bar',
                height: blockItemCoverList.length * 30
            },
            title: {
                text: _cong + "Coverage Chart"
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: blockItemList,
                allowDecimals : false,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                allowDecimals : false,
                title: {
                    text: 'Number of times worked',
                    align: 'high'
                }
            },
            tooltip: {
                formatter: function() {
                    return ''+
                        this.series.name +': '+ this.y +' times';
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -100,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Cover Count',
                data: blockItemCoverList
            }]
        });
		    
	}


	
});






