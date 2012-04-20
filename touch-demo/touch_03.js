Ext.setup({
    onReady: function () {

        zingchart.liburl = "../zingchart_trial/zingchart.swf";

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

		var c = 0;

		function paintCharts() {
			for (var i=0;i<charts;i++) {
				if (document.getElementById('panel'+i+'-main')) {
					zingchart.exec('panel'+i, 'destroy');
				}
			}
			c = 0;
			for (var i=0;i<charts;i++) {
				window.setTimeout(function(i) {
					zingchart.render({
						width: 300,
						height: 200,
						output: 'canvas',
						defaultsurl : 'touch_03.txt',
						id: 'panel' + i,
						data: g()
					});
				}, i*20, i);
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
