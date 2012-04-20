Ext.onReady(function() {
    zingchart.liburl = '../zingchart_trial/zingchart.swf';
    new ExtX.ZingChart.Panel({
        title: 'Line Chart',
        width: 640,
        height: 400,
        renderTo: 'panel',
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
    });
});
