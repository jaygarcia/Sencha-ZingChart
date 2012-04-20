Ext.onReady(function() {
	zingchart.liburl = '../zingchart_trial/zingchart.swf';
	ExtX.ZingChart.output = "canvas";
	new Ext.Button({
		renderTo: 'button',
		text: 'Click to open window',
		handler: function() {
			var dialog = new Ext.Window({
				title: 'Chart in a window',
				modal: true,
				width: 640,
				height: 480,
				resizable: true,
				maximizable: true,
				closable: true,
				layout: 'fit',
				items: [
					new ExtX.ZingChart.Panel({
						data: {
							graphset: [
								{
									type: "line",
									"scale-x": {
										"min-value": 0,
										"max-value": 11,
										
										"labels": [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
									},
									series: [
										{
											values: [ 1, 11, 28, 42, 26, 13, 32, 15, 12, 17, 4, 19 ],
											text: "Apples"
										}
									]
								}
							]
						}
					})
				],
				buttonAlign: 'center',
				buttons: [
					{
						text: 'Close',
						handler: function() {
							dialog.close();
						}
					}
				]
			});
			dialog.show();
		}
	})
});
