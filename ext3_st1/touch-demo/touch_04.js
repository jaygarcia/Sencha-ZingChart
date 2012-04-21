Ext.setup({
    onReady: function () {

		var charts = 50;

		for (var i=0;i<charts;i++) {
			$(document.body).append('<div id="panel' + i + '" style="float:left;margin:10px;"></div>')
		}

		var aCharts = [], c = 0;
		var types = ['decline', 'confirm'];

		function paintCharts() {
			for (var i=0;i<charts;i++) {
				if (aCharts[i]) {
					aCharts[i].destroy();
				}
			}
			aCharts = [];
			c = 0;
			for (var i=0;i<charts;i++) {
		        var panel = new Ext.Panel({
		        	html: 'HTML ' + parseInt(9999*Math.random(), 10),
		            renderTo: 'panel' + i,
		            width: 200,
		            height: 100,
		            items: [
				        {
				            items: [
				                new Ext.Button({
				                    ui  : types[parseInt(types.length*Math.random(), 10)],
				                    text: 'Button ' + parseInt(9999*Math.random(), 10)
				                })
			                ]
				        }
				    ]
		        });
		        aCharts.push(panel);
			}
			console.error('End');
			setTimeout(paintCharts, 1000);
		}

		window.setTimeout(paintCharts, 1000);

    }
});
