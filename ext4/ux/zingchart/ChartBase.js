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

        //TODO: Move to prototype
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

        if (typeof(me.__initComponent__) != 'undefined') {
            zingchart.exec(me.flashContainerID, 'resize', {
                width  : targetEl.getWidth(),
                height : targetEl.getHeight()
            });
        }
        else {
            me.__initComponent__ = true;
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
                contentEl = me.getTargetEl();

            zingchart.render({
                dataurl     : me.dataurl,
                data        : me.chartData && Ext.encode(me.prepareData(me.chartData)),
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

            me.un('afterlayout', me.onFirstLayout, me);
            me.on('afterlayout', me.onAfterLayout, me);
        }, 1);
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
    destroy      : function() {
        /* added by A.Z. on 29.03.2011 */
        this.zcdestroy();

        this.callparent();
    }
})
;