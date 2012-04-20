Ext.onReady(function () {
    
    zingchart.liburl          = "../zingchart_trial/zingchart.swf"
    
    var applesStore = new Ext.data.ArrayStore({
        fields: [
           { name: 'month' },
           { name: 'salesVolume' }
        ],
        
        data : [
            [0,1],[1,11],[3,28],[5,42],[7,26],[9,13],[10,32],[11,12]
        ]
    })
    
    var months      = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    
    var chartPanel   = new ExtX.ZingChart.Panel({
        
        width       : 500,
        height      : 300,
        
        title       : 'Chart',
        
        data        : {
            graphset : [
                {
                    type        : "line",
                    "scale-x"   : {
                        "min-value"     : 0,
                        "max-value"     : 11,
                        
                        "labels"        : months
                    },
                    series : [
                        {
                            text        : "Apples",
                            
                            store       : applesStore,
                            xField      : 'month',
                            yField      : 'salesVolume'
                        }
                    ]
                }
            ]
        },
        
        renderTo    : Ext.get('panel') // Ext.getBody()
    })
    
    
    var dataGrid = new Ext.grid.EditorGridPanel({
        
        title   : 'Data (click on value to edit)',
        
        store   : applesStore,
        
        clicksToEdit    : 1,
        
        columns : [ 
            {
                header          : 'Month',
                dataIndex       : 'month',
                
                renderer        : function (value, metaData, record, rowIndex, colIndex, store) {
                    return months[ value ]
                }
            },
            {
                header          : 'Sales volume',
                dataIndex       : 'salesVolume',
                
                editor          : new Ext.form.NumberField()
            }
        ],
        
        selModel    : new Ext.grid.RowSelectionModel({ singleSelect : true }),
        
        width       : 500,
        height      : 300,
        
        renderTo    : Ext.get('panel'), // Ext.getBody(),
        
        style       : {
            'padding-top' : '10px'
        }
    })
    
    
    dataGrid.on('afteredit', function (event) {
        
        chartPanel.setnodevalue({
            
            plotindex   : 0,
            nodeindex   : applesStore.indexOf(event.record),
            value       : event.value
        })
        
        event.record.commit()
    })
})