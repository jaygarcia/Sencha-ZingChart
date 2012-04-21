Ext.onReady(function() {
	zingchart.liburl = '../zingchart_trial/zingchart.swf';
	ExtX.ZingChart.output = "canvas";
	new Ext.Panel({
		renderTo: 'panel',
		width: 640,
		height: 480,
		layout: 'border',
		items: [
			{
				region: 'north',
				height: 22,
				html: 'NORTH REGION'
			},
			{
				region: 'west',
				width: 100,
				html: 'WEST REGION'
			},
			{
				region: 'east',
				width: 100,
				html: 'EAST REGION'
			},
			{
				region: 'south',
				height: 22,
				html: 'SOUTH REGION'
			},
			new ExtX.ZingChart.Panel({
				region: 'center',
				title: 'Line Chart',
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
		]
	})
});
