Ext.setup({
    onReady: function () {

        zingchart.liburl = "../zingchart_trial/zingchart.swf";
		ExtX.ZingChart.output = "svg";

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
				_theme : 'mini',
				graphset : [
					{
						type : 'line',
						series : [
							{
								values : d(10),
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

		var charts = 8;

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

		        var panel = new ExtX.ZingChart.Panel({
		            renderTo: 'panel' + i,
		        	output: 'svg',
		            width: 300,
		            height: 200,
		            data: g(),
		            defaultsurl : 'touch_02.txt'
		        });
		        aCharts.push(panel);

			}
		}

		zingchart.complete = function() {
			c++;
			if (c == charts) {
				setTimeout(paintCharts, 1000);
			}
		}

		window.setTimeout(paintCharts, 1000);

    }
});
