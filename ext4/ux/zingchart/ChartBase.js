Ext.define('Ext.ux.zingchart.ChartBase', {
    mixins : {
        methods : 'Ext.ux.zingchart.Methods'
    },

    hideMode : 'offsets',
    /**
     * @cfg String output
     * Can be either 'flash' or 'canvas', which will make this chart instance to use according rendering engine. Defaults to the value of the {@link Ext.ux.zingchart#output Ext.ux.zingchart.output} property.
     */
    output   : 'canvas',

    /**
     * @cfg Object chartData
     * A JSON object, containing the description of the chart. For the format description, please refer to the: <a href="http://www.zingchart.com/learn/">ZingChart documentation</a>
     */
    chartData : null,

    /**
     * @cfg String dataurl
     * A URL, a GET request to which should return a JSON packet, describing the chart
     */
    dataurl : null,

    flashVars : null,

    /**
     * @cfg String defaultsurl
     * A URL, a GET request to which should return a JSON packet, describing the chart default style
     */
    defaultsurl : null,

    /**
     * @cfg Object defaults
     * A JSON object, containing the description of the chart default style
     */
    defaults : null,

    /**
     * @cfg String mode
     * "static" option only, creates a more flattened version of the chart, with the dynamic features disabled
     */
    mode : null,

    /**
     * @cfg String wmode
     * A value of the 'wmode' parameter for the &lt;object&gt; tag.
     */
    wmode : 'opaque',

    flashContainerID : null,

    /**
     * @property ready
     * @type Number
     *
     * This property can be used to determine whether the chart has been already loaded. It will be set to 'true' after the 'load' event has been fired.
     */
    ready : false,

    initComponent : function() {
        var me = this;
        me.output = me.output || Ext.ux.zingchart.output;

        if (me.store) {
            if (me.store.data.items.length > 0) {
                me.onStoreLoadSetChartData();
            }

            me.store.on({
                scope  : me,
                load   : me.onStoreLoadSetChartData,
                update : me.onStoreUpdate
            });
        }

        // added by mschwartz to handle resize event
        me.on({
            scope       : me,
            load        : me.onLoad,
            resize      : me.onResizeSetChartSize,
            afterlayout : {
                single : true,
                scope  : me,
                fn     : me.onFirstLayout
            }
        });

    },

    onResizeSetChartSize : function() {
        var me = this,
            targetEl = me.getTargetEl();

        if (me.flashContainerID && me.chartRendered) {
            zingchart.exec(me.flashContainerID, 'resize', {
                width  : targetEl.getWidth(),
                height : targetEl.getHeight()
            });
        }
    },

    onLoad : function() {
        this.ready = true;
    },

    onFirstLayout : function() {
        var me = this;

        me.flashContainerID = me.getTargetEl().createChild({}).id;

        // we really have to let Ext do the layout and move around our components
        // so defer it for at least 10ms
        // (effectively a setTimeout kind of thing)
        Ext.Function.defer(function() {
            var chartID = me.flashContainerID,
                contentEl = me.getTargetEl(),
                chartJson = me.chartData && Ext.encode(me.prepareData(me.chartData));

            zingchart.render({
                dataurl     : me.dataurl,
                data        : chartJson,
                id          : chartID,
                output      : me.output,
                width       : contentEl.getWidth(),
                height      : contentEl.getHeight(),
                defaultsurl : me.defaultsurl,
                defaults    : me.defaults,
                wmode       : me.wmode,
                mode        : me.mode,
                /*'auto-resize': true,*/
                flashvars   : me.flashvars || {
                    allowlocal : 0
                }
            });

            me.chartRendered = true;

            me.un('afterlayout', me.onFirstLayout, me);
            me.on('afterlayout', me.onAfterLayout, me);
        }, 10);
    },

    onAfterLayout : function() {
        var contentEl = this.getTargetEl(this);
        Ext.get(this.flashContainerID).setSize(contentEl.getSize());
    },

    prepareData : function(data) {
        Ext.each(data.graphset, function(graphset) {

            Ext.each(graphset.series, function(series) {
                if (series.values && series.store) {
                    throw "Can't provide both 'values' and 'store' for series [" + Ext.encode(series) + "] in graphset [" + Ext.encode(graphset) + "]";
                }
                if (!series.values && !series.store) {
                    throw "Should provide either 'values' or 'store' for series [" + Ext.encode(series) + "] in graphset [" + Ext.encode(graphset) + "]";
                }

                if (series.values) {
                    return;
                }

                if (series.store) {
                    var values = series.values = [],
                        xField = series.xField,
                        yField = series.yField || 'value';

                    series.store.each(function(record) {
                        if (series.converter) {
                            var res = series.converter(record, series.store.indexOf(record));
                            values.push(res);
                            return;
                        }

                        if (xField) {
                            values.push([ record.get(xField), record.get(yField) ]);
                            return;
                        }
                        values.push(record.get(yField));
                    });

                }
                delete series.store;
                delete series.xField;
                delete series.yField;
                delete series.converter;
            });
        });

        return data;
    },

    /**
     * This is a thing wrapper around the 'setdata' method, which allows you to omit the external "{ data : ... }" key of the JSON object:
     * <pre>chart.setData({ series : [ ... ]})</pre>
     * @Override
     * @param {Object} params Data to set in the chart
     */
    setChartData : function(data) {
        this.setdata({
            data : this.prepareData(data)
        });
    },

    onStoreLoadSetChartData : function(store) {
        var me = this;

        //        var chartData = {
        //            graphset : [
        //                {
        //                    type      : "line",
        //                    "scale-x" : {
        //                        "labels"    : months
        //                    },
        //                    series    : [
        //                        {
        //                            text    : "Apples",
        //                            animate : true,
        //                            effect  : 1,
        //                            xField  : 'month',
        //                            yField  : 'salesVolume'
        //                        }
        //                    ]
        //                }
        //            ]
        //        };

        var newSeries = [],
            chartConfig = Ext.clone(me.chartConfig);

        Ext.each(chartConfig.series, function(seriesItem, i) {
            var item = Ext.clone(seriesItem);
            item.values = me.extractKeyFromStore(item.dataIndex);

            newSeries[i] = item;
        });

        chartConfig.series = newSeries;

        chartConfig['scale-x'] = {
            labels : me.extractKeyFromStore(chartConfig.labelField)
        };

        var chartData = {
            graphset : [ chartConfig ]
        };


        if (me.chartRendered) {
            me.setChartData(chartData);
        }
        else {
            me.chartData = chartData;
        }
    },

    extractKeyFromStore : function(key) {
        var data = [];

        this.store.each(function(record, i) {
            data[i] = record.get(key);
        });

        return data;
    },

    onStoreUpdate : function(store, record) {
        var me = this;

        Ext.each(me.chartConfig.series, function(series, index) {
            me.setnodevalue({
                plotindex : index,
                nodeindex : store.indexOf(record),
                value     : record.get(series.dataIndex)
            });
        });
    },

    destroy : function() {
        var me = this;
        if (me.store) {
            me.store.un('load', me.onStoreLoadSetChartData, me);
        }
        me.zcdestroy();

        me.callparent();
    }
});