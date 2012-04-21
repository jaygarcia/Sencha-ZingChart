Ext.onReady(function() {
    zingchart.liburl = '../zingchart_trial/zingchart.swf';
    ExtX.ZingChart.output = "canvas";
    new ExtX.ZingChart.Panel({
        title    : 'Line Chart',
        width    : 640,
        height   : 400,
        renderTo : 'panel',
        data     : {
            graphset : [
                {
                    type      : "area",
                    plot : {
                        animate : true,
                        effect : 1,
                        "spline":true,
                        "alpha-area":0.5
                    },
                    "scale-x" : {
                        "min-value" : 0,
                        "max-value" : 11,
                       "zooming":true,

                        "labels" : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
                    },
                    series    : [
                        {
                            values : [ 1, 11, 28, 42, 26, 13, 32, 15, 12, 17, 4, 19 ],
                            text   : "Apples"
                        },
                        {
                            values : [ 2, 12, 22, 50, 21, 17, 39, 10, 11, 10, 8, 20 ],
                            text   : "Oranges"
                        }
                    ]
                }
            ]
        }
    });
});
