Ext.onReady(function() {
	zingchart.liburl = '../zingchart_trial/zingchart.swf';
	ExtX.ZingChart.output = "canvas";

	function d(n) {
		var v = [];
		for (var i=0;i<n;i++) {
			v.push(ZC._r_(0,10));
		}
		return v;
	}

	function def() {
		return {
			root : {
				gui : {
					contextMenu : {
						button : {
							visible : 0
						}
					}
				}
			},
			graph : {
				backgroundColor : '#eee',
				plotarea : {
					margin : 5
				}
			}
		}
	}

	function g() {
		return {
			theme : 'mini',
			graphset : [
				{
					type : 'line',
					series : [
						{
							values : d(30),
							lineColor : 'rgb(' + ZC._r_(0,255) + ',' + ZC._r_(0,255) + ',' + ZC._r_(0,255) + ')'
						}
					],
					plot : {
						exact : true
					}
				}
			]
		}
	}

	var charts = 50;

	for (var i=0;i<charts;i++) {
		$(document.body).append('<div id="panel' + i + '" style="float:left;margin:10px;"></div>')
	}

	var aCharts = [], c = 0;

	function paintCharts() {
		for (var i=0;i<charts;i++) {
			if (aCharts[i]) {
				aCharts[i].destroy();
			}
		}
		aCharts = [];
		c = 0;
		for (var i=0;i<charts;i++) {
			var chart = new ExtX.ZingChart.Panel({
				title: 'Chart',
				width: 300,
				height: 200,
				output: 'canvas',
				defaultsurl : 'demo12.txt',
				renderTo: 'panel' + i,
				data: g()
			});
			aCharts.push(chart);
		}
	}

	zingchart.complete = function() {
		c++;
		if (c == charts) {
			setTimeout(paintCharts, 10000);
		}
	}

	/*
	console.log(ZC.VERSION);
	zingchart.click = function(p) {
		console.log('click', p);
	}
	*/

	window.setTimeout(paintCharts, 1000);

});
