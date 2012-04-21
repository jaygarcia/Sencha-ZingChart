Ext.setup({
    onReady: function () {
        
        zingchart.liburl = "../zingchart_trial/zingchart.swf";
		ExtX.ZingChart.output = "canvas";

        var panel = new ExtX.ZingChart.Panel({
            fullscreen: true,
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
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    title: 'ZingChart',
                    items: [
                        new Ext.Button({
                            text: 'Popup',
                            handler: function() {
                                var me = this;
                                if (!this.popup) {
                                    this.popup = new ExtX.ZingChart.Panel({
                                        floating: true,
                                        modal: true,
                                        centered: true,
                                        width: 300,
                                        height: 300,
                                        draggable: true,
                                        hideOnMaskTap: false,
                                        dockedItems: [
                                            {
                                                dock: 'top',
                                                xtype: 'toolbar',
                                                title: 'Popup',
                                                items: {
                                                    text: 'Close',
                                                    handler: function() {
                                                        me.popup.hide();
                                                    }
                                                }
                                            }
                                        ],
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
                                }
                                this.popup.show('pop');
                            }
                        })
                    ]
                }
            ]
        });
    }
});
