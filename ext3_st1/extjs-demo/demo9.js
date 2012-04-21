Ext.onReady(function () {
    
    zingchart.liburl          = "../zingchart_trial/zingchart.swf";
	ExtX.ZingChart.output = "canvas";
    
    var dataStore = new Ext.data.ArrayStore({
        idIndex : 0,
        
        fields: [
            { name   : 'region' },
            { name   : 'totalSales' },
           
            { name   : 'pcPct' },
            { name   : 'laptopPct' },
            { name   : 'tabletsPct' },
            { name   : 'phonesPct' },
            { name   : 'softwarePct' }
        ],
        
        data : [
            [ 'USA',    18934598, 15, 25, 11, 35, 14 ],
            [ 'Europe', 15798134, 19, 36, 6,  18, 21 ],
            [ 'Asia',   13587109, 28, 18, 7,  44, 3 ],
            [ 'Other',   1239684, 25, 21, 5,  39, 10 ]
        ]
    })
    
    var pctRenderer = function (value) {
        return value + '%'
    }
    
    var panel = new Ext.Panel({
        
        width       : 800,
        height      : 600,
        
        title       : 'Sales data',
        
        bodyStyle   : 'padding : 5px',
        
        layout      : 'vbox',
        layoutConfig    : {
            align   : 'stretch'
        },
        
        items : [
            {
                xtype       : 'container',
                
                flex        : 0.5,
                
                layout      : 'hbox',
                layoutConfig    : {
                    align   : 'stretch'
                },
                
                bodyStyle   : 'padding : 5px',
                
                items       : [
                    {
                        xtype   : 'grid',
                        id    : 'grid',
                        
                        store   : dataStore,
                        
                        columns : [ 
                            {
                                header          : 'Region',
                                dataIndex       : 'region'
                            },
                            {
                                header          : 'Total sales',
                                dataIndex       : 'totalSales',
                                
                                width           : 200,
                                renderer        : Ext.util.Format.usMoney,
                                align           : 'center',
                                sortable        : true
                            },
                            {
                                header          : 'PCs',
                                dataIndex       : 'pcPct',
                                
                                renderer        : pctRenderer,
                                align           : 'center',
                                sortable        : true
                            },
                            {
                                header          : 'Laptops',
                                dataIndex       : 'laptopPct',
                                
                                renderer        : pctRenderer,
                                align           : 'center',
                                sortable        : true
                            },
                            {
                                header          : 'Tablets',
                                dataIndex       : 'tabletsPct',
                                
                                renderer        : pctRenderer,
                                align           : 'center',
                                sortable        : true
                            },
                            {
                                header          : 'Phones',
                                dataIndex       : 'phonesPct',
                                
                                renderer        : pctRenderer,
                                align           : 'center',
                                sortable        : true
                            },
                            {
                                header          : 'Software',
                                dataIndex       : 'softwarePct',
                                
                                renderer        : pctRenderer,
                                align           : 'center',
                                sortable        : true
                            }
                        ],
                        
                        selModel    : new Ext.grid.RowSelectionModel({ singleSelect : true }),
                        
                        viewConfig  : {
                            forceFit    : true
                        },
                        
                        flex        : 0.6
                    },
                    {
                        xtype       : 'form',
                        id        : 'form',
                        
                        flex        : 0.4,
                        bodyStyle   : 'padding : 5px',
                        style       : 'padding-left : 5px',
                        
                        items       : [
                            {
                                xtype           : 'fieldset',
                                title           : 'Region details',
                                
                                labelWidth      : 90,
                                border          : false,
                                
                                defaults        : {
                                    width   : 140,
                                    border  : false
                                },
                                defaultType     : 'textfield',
                                
                                items : [
                                    {
                                        fieldLabel      : 'Region',
                                        name            : 'region'
                                    },
                                    {
                                        fieldLabel      : 'Total sales',
                                        name            : 'totalSales'
                                    },
                                    {
                                        fieldLabel      : 'PCs %',
                                        name            : 'pcPct'
                                    },
                                    {
                                        fieldLabel      : 'Laptops %',
                                        name            : 'laptopPct'
                                    },
                                    {
                                        fieldLabel      : 'Tablets %',
                                        name            : 'tabletsPct'
                                    },
                                    {
                                        fieldLabel      : 'Phones %',
                                        name            : 'phonesPct'
                                    },
                                    {
                                        fieldLabel      : 'Software %',
                                        name            : 'softwarePct'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype       : 'ExtX.ZingChart.Panel',
                flex        : 0.5,
                
                tbar        : [
                    'Type: ',
                    {
                        text            : 'Pie',
                        
                        toggleGroup     : 'chartType',
                        enableToggle    : true,
                        pressed         : true,
                        
                        listeners       : {
                            toggle      : function (button, pressed) { barTypeChange(button, pressed) }
                        }
                    },
                    '-',
                    {
                        text            : 'Bar',
                        
                        toggleGroup     : 'chartType',
                        enableToggle    : true,
                        
                        listeners       : {
                            toggle      : function (button, pressed) { barTypeChange(button, pressed) }
                        }
                    }
                ],
                
                id        : 'chart',
                
                style       : 'padding-top : 5px',
                
                data        : {}
            }
        ],
        
        renderTo    : Ext.get('panel') // Ext.getBody()
    })
    
    
    var grid            = Ext.getCmp('grid');
    var chart           = Ext.getCmp('chart');
    var form           = Ext.getCmp('form');
    var chartType       = 'pie'
    
    var barTypeChange   = function (button, pressed) {
        if (pressed) {
            chartType = button.text.toLowerCase()
            
            updateChartForRecord(chartType, grid.getSelectionModel().getSelected())
        }
    }
    
    
    grid.getSelectionModel().on('rowselect', function (selModel, rowIndex, record) {
        
        form.getForm().loadRecord(record)
        
        updateChartForRecord(chartType, record)
    })
    
    var updateChartForRecord = function (chartType, record) {
        var series = [
            {
                text    : 'PCs',
                values  : [ record.get('pcPct') ]
            },
            {
                text    : 'Laptops',
                values  : [ record.get('laptopPct') ]
            },
            {
                text    : 'Tablets',
                values  : [ record.get('tabletsPct') ]
            },
            {
                text    : 'Phones',
                values  : [ record.get('phonesPct') ]
            },
            {
                text    : 'Software',
                values  : [ record.get('softwarePct') ]
            }
        ]
        
        chart.setData({
            graphset : [
                {
                    type    : chartType,
                    
                    legend  : {},
                    series  : series,
                    
                    "plot" : {
                        "valueBox" : {
                            "type"          : "max",
                            "text"          : "%v%",
                            "textAlign"    : "center",
                            //"backgroundColor"  : "#ffffff",
                            "placement"         : "out"
                        }
                    }
                }
            ]
        });
    }
    
    
    grid.on('viewready', function (event) {
        
        var selectFirstRow = function () {
            grid.getSelectionModel().selectRow(0)    
        }
        
        if (chart.ready) 
            selectFirstRow()
        else
            chart.on('load', selectFirstRow)
    })
});
