/**
 * Universal ZingChart wrapper for ExtJS and Sencha Touch
 */

;(function () {
    Ext.ns('ExtX.ZingChart');

    var isTouch = Ext.TouchEventObject ? true : false;
    // setting up methods

    var methodNames = [
        'addnode',
        'addplot',
        'load',
        'modify',
        'modifyplot',
        'reload',
        'removenode',
        'removeplot',
        'setdata',
        'setnodevalue',
        'getdata',
        'getgraphlength',
        'getnodelength',
        'getnodevalue',
        'getplotlength',
        'getplotvalues',
        'showversion',
        'addnodeia',
        'entereditmode',
        'exiteditmode',
        'removenodeia',
        'removeplotia',
        'legendmaximize',
        'legendminimize',
        'plothide',
        'plotshow',
        'toggleabout',
        'togglebugreport',
        'toggledimension',
        'togglelegend',
        'togglelens',
        'togglesource',
        'zoomin',
        'zoomout',
        'zoomto',
        'zoomtovalues',
        'clearfeed',
        'getinterval',
        'setinterval',
        'startfeed',
        'stopfeed',
        'goback',
        'goforward',
        'exportdata',
        'print',
        'saveasimage',

        'resize',

        /* added by A.Z. on 29.03.2011 */
        'zcdestroy',
        'addobject',
        'removeobject',
        'updateobject',
        'getxyinfo',

        /* added by A.Z. on 31.03.2011 */
        'appendseriesvalues',
        'setseriesvalues',
        'setseriesdata',
        'getrender',
        'clear',
        'enable',
        'disable',
        'getimagedata'

    ];

    var methods = {};
    Ext.each(methodNames, function (methodName) {
        methods[ methodName ] = function (args) {
            var argsStr = args && Ext.encode(args) || undefined;
            return zingchart.exec(this.flashContainerID, methodName, argsStr);
        };
    });

    // setting up the events proxies
    var events = [
        'modify',
        'node_add',
        'node_modify',
        'node_remove',
        'plot_add',
        'plot_modify',
        'plot_remove',
        'reload',
        'setdata',
        'click',
        'complete',
        'legend_item_click',
        'load',
        'node_click',
        'node_doubleclick',
        'node_mouseout',
        'node_mouseover',
        'plot_click',
        'plot_doubleclick',
        'plot_mouseout',
        'plot_mouseover',
//            'resize',
        'about_hide',
        'about_show',
        'bugreport_hide',
        'bugreport_show',
        'dimension_change',
        'legend_hide',
        'legend_maximize',
        'legend_minimize',
        'legend_show',
        'lens_hide',
        'lens_show',
        'plot_hide',
        'plot_show',
        'source_hide',
        'source_show',
        'node_deselect',
        'node_select',
        'plot_deselect',
        'plot_select',
        'zoom',
        'feed_clear',
        'feed_interval_modify',
        'feed_start',
        'feed_stop',
        'history_back',
        'history_forward',
        'data_export',
        'image_save',
        'print',

       	/* added by A.Z. on 23.05.2011 */
        'label_click',
        'label_mouseover',
        'label_mouseout',
        'shape_click',
        'shape_mouseover',
        'shape_mouseout'
    ];

    var registry = {};
    Ext.each(events, function (event) {
        zingchart[ event ] = function (params) {
            var chartID = params && params.id;
            if (!chartID) {
                return;
            }
            var chart   = registry[ chartID ];
            if (!chart) {
                return;
            }
            chart.fireEvent(event, chart, params);
        };
    });


    /**
     * @namespace ExtX.ZingChart
     * @class ExtX.ZingChart.Container
     * @extends Ext.Container
     *
This is a subclass of the Ext.Container, which renders the ZingChart in itself. There are also <b>ExtX.ZingChart.Panel</b> and <b>ExtX.ZingChart.Window</b> classes which are the subclasses of the according ExtJS classes,
and provides exactly the same interface as the ExtX.ZingChart.Container. You can use any of these classes, picking up the most convenient one for the current task
(Window for charts in popup, Panel for charts with toolbars and Container for simple chart box) <br/><br/>

To create a chart, simply instantiate the component as usual and provide an additional "data" config option, describing the chart:
<pre>
var panel   = new ExtX.ZingChart.Panel({

    width       : 800,
    height      : 600,

    title       : 'Hello world',

    data        : {
        graphset : [
            {
                type        : "line",
                "scale-x"   : {
                    "min-value"     : 0,
                    "max-value"     : 11,

                    "labels"        : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
                },
                series : [
                    {
                        values      : [ 1, 11, 28, 42, 26, 13, 32, 15, 12, 17, 4, 19 ],
                        text        : "Apples"
                    }
                ]
            }
        ]
    },

    renderTo    : Ext.getBody()
})
</pre>

<h2>Integration with Ext.data.Store</h2>

<h4>Simplest case</h4>

In the simplest case, ZingChart will extract the 'value' field of store's records:

<pre>
    var applesStore = new Ext.data.ArrayStore({
        fields: [
            { name: 'value' }
        ],

        data : [
            [ 1 ], [ 11 ], [ 28 ], [ 42 ], [ 26 ], [ 13 ], [ 32 ], [ 15 ], [ 12 ], [ 17 ], [ 4 ], [ 19 ]
        ]
    })
</pre>

For that, just provide the store instance instead of 'values' key of the 'series' object.<br><br>

Instead of:

<pre>
    series : [
        {
            text        : "Apples",

            values      : [ 1, 11, 28, 42, 26, 13, 32, 15, 12, 17, 4, 19 ],
        }
    ]
</pre>

provide the store:

<pre>
    series : [
        {
            text        : "Apples",

            store       : applesStore
        }
    ]
</pre>

There are some additional options. For example, if the value for graph is stored in the field with the name other than "value", you can specify it with 'yField' option:

<pre>
    // store
    var applesStore = new Ext.data.ArrayStore({
        fields: [
            { name: 'salesVolume' }
        ],
        ...
    })

    // graph descrpition
    series : [
        {
            text        : "Apples",

            store       : applesStore,
            yField      : 'salesVolume'
        }
    ]
</pre>

<h4>Specifying the values for X axis</h4>

If you want to specify the x-coordinates for the graph points, and those x-coords are stored in the other field of the data store:

<pre>
    var applesStore = new Ext.data.ArrayStore({
        fields: [
            { name: 'month' },
            { name: 'salesVolume' }
        ],

        data : [
            [0,1], [1,11], [3,28], [5,42], [7,26], [9,13], [10,32], [11,12]
        ]
    })
</pre>

then provide the 'xField' option when passing the store to chart:

<pre>
    series : [
        {
            text        : "Apples",

            store       : applesStore,
            xField      : 'month',
            yField      : 'salesVolume'
        }
    ]
</pre>

Note, that you can omit some x-values this way.


<h4>Extracting data from record</h4>

In general case, to extract data from the store's record, you can provide the 'converter' function. For example the previous
example can be rewritten as:

<pre>
    series : [
        {
            text        : "Apples",

            store       : applesStore,

            converter   : function (record, index) {
                return [ record.get('month'), record.get('value') ]
            }
        }
    ]
</pre>

The 'converter' will be called for each record in store, and receive the record and it's index as the arguments.
Anything returned from the 'converter', will be 'push'ed to the 'values' of the series.<br/><br/>

The same store can be supplied for different chart series, using different 'x/yField' options or 'converter's.<br/><br/>

See also "/demo/02_grid_and_store.html" in the source package for the complete integration example. <br/><br/>


<h2>Chart methods</h2>

All ExtX.ZingChart.* classes provides a number of additional methods for chart manipulation. <b>Important note:</b> all of chart methods are available only after
initial load of the chart, which will be indicated by the 'load' event. So they should be used as:

<pre>
    var panel   = new ExtX.ZingChart.Panel({ ... })

    // wait for 'load' event
    panel.on('load', function () {

        // now can use chart methods
        panel.addnode({ value : 10 })

        var count = panel.getnodelength({ plotindex : 1 })

        // etc
    })
</pre>

See also <a href="http://www.zingchart.com/learn/">ZingChart documentation</a> for additional information.

     */

    /**
     * @event modify Dispatches when ZingChart is modified via the modify API call.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
     *
<ul>

<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>data</b> - The new configuration data</li>
<li><b>object</b> - The object to modify if set in the API call</li>

</ul>
     */

    /**
     * @event node_add Dispatches when the user adds a plotnode.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>

<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>

</ul>
     */

    /**
     * @event node_modify Dispatches when the user modifies a plotnode
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>

<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>

</ul>
     */


    /**
     * @event node_remove Dispatches when the user removes a plotnode
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>

<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>

</ul>
     */


    /**
     * @event plot_add Dispatches when a plot is added to the graph.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>

<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>data</b> - The data of the new plot</li>

</ul>
     */


    /**
     * @event plot_modify Dispatches when a plot is modified.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>

<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>data</b> - The new configuration data</li>

</ul>
     */


    /**
     * @event plot_remove Dispatches when a plot is removed.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>

<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>

</ul>
     */


    /**
     * @event reload Dispatches when ZingChart is reloaded.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>

<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event setdata Dispatches when the setdata API function is called.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>

<li><b>id</b> - The ID of chart</li>
<li><b>data</b> - The new configuration data</li>
</ul>
     */

    /**
     * @event click Dispatches when the user clicks anywhere on the graph
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event complete Dispatches when ZingChart completes loading.  Note: This occurs not only after initial load, but also after invoking any of the reload data API calls.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event legend_item_click Dispatches when a legend item is clicked.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
</ul>
     */


    /**
     * @event load Dispatches when ZingChart completes initial load.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event node_click Dispatches when the user clicks a plotnode
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>
</ul>
     */


    /**
     * @event node_doubleclick Dispatches when the user double clicks a plotnode
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>
</ul>
     */


    /**
     * @event node_mouseout Dispatches when the user mouses out of a plotnode
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>
</ul>
     */


    /**
     * @event node_mouseover Dispatches when the user mouses over a plotnode
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>
</ul>
     */


    /**
     * @event plot_click Dispatches when a plot is clicked.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
</ul>
     */


    /**
     * @event plot_doubleclick Dispatches when a plot is double clicked.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
</ul>
     */


    /**
     * @event plot_mouseout Dispatches when the user mouses out of a plot.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
</ul>
     */


    /**
     * @event plot_mouseover Dispatches when a user mouses over a plot.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
</ul>
     */


    /**
     * @event resize Dispatches on resize.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event about_hide Dispatches when the About Screen is closed.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event about_show Dispatches when the About Screen is displayed.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event bugreport_hide Dispatches when the Report Bug Screen is closed.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event bugreport_show Dispatches when the Report Bug Screen is displayed.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event dimension_change Dispatches when the dimension is toggled between 2D and 3D.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>dimension</b> - The new dimension</li>
<li><b>type</b> - The new graph type</li>
</ul>
     */


    /**
     * @event legend_hide Dispatches when the legend is hidden.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event legend_maximize Dispatches when the legend is maximized.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event legend_minimize Dispatches when the legend is minimized.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event legend_show Dispatches when the legend is displayed.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event lens_hide Dispatches when the lens is hidden.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event lens_show Dispatches when the lens is displayed
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event plot_hide Dispatches when a plot is hidden.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>visible</b> - Boolean indicating if the plot is visible or hidden.</li>
</ul>
     */


    /**
     * @event plot_show Dispatches when a plot is shown after being hidden.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>visible</b> - Boolean indicating if the plot is visible or hidden.</li>
</ul>
     */


    /**
     * @event source_hide Dispatches when the View Source Screen is closed.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event source_show Dispatches when the View Source Screen is displayed.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event node_deselect Dispatches when the node is no longer selected.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>
</ul>
     */


    /**
     * @event node_select Dispatches when a node is selected
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
<li><b>nodeindex</b> - The index of the node</li>
<li><b>key</b> - The node's key</li>
<li><b>value</b> - The value of the node</li>
<li><b>text</b> - The text that would display in the tooltip for the node</li>
</ul>
     */


    /**
     * @event plot_deselect Dispatches when a plot is no longer selected.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
</ul>
     */


    /**
     * @event plot_select Dispatches when a plot is selected.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>graphid</b> - The ID of graph</li>
<li><b>plotindex</b> - The index of the plot</li>
</ul>
     */


    /**
     * @event zoom Dispatches when a zoom event occurs.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>xmin</b> - The x-min value of the zoom</li>
<li><b>xmax</b> - The x-max value of the zoom</li>
<li><b>ymin</b> - The y-min value of the zoom</li>
<li><b>ymax</b> - The y-max value of the zoom</li>
</ul>
     */


    /**
     * @event feed_clear Dispatches when the feed is cleared.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event feed_interval_modify Dispatches when the feed interval is modified.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>interval</b> - The new interval</li>
</ul>
     */


    /**
     * @event feed_start Dispatches when the feed starts.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event feed_stop Dispatches when the feed stops.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event history_back Dispatches when the user backs through history.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>index</b> - The index in history the user is at</li>
</ul>
     */


    /**
     * @event history_forward Dispatches when the user goes forward through the history.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
<li><b>index</b> - The index in history the user is at</li>
</ul>
     */


    /**
     * @event data_export Dispatches when the user exports the graph data.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event image_save Dispatches when the user saves an images of the graph.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */


    /**
     * @event print Dispatches when the user prints the graph.
     * @param {Object} chart Chart instance
     * @param {Object} event Object with the event properties:
<ul>
<li><b>id</b> - The ID of chart</li>
</ul>
     */





    /**
     * Adds a node to an existing plot.
     * @method addnode
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>plotindex</b> - The index of the plot to add data to.</li>
<li><b>nodeindex</b> - The index in the specified plot where the new node should go. The current values will be shifted. If this parameter is not set, it is placed at the end.</li>
<li><b>value</b> - The value to add to the plot.</li>
</ul>
     */


    /**
     * Adds a new plot.
     * @method addplot
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>plotindex</b> - the index of the plot to be inserted. If it is not set, it is placed at the end.</li>
<li><b>plotdata</b> - The JSON string that would be set in the series section of the JSON for the individual plot.</li>
</ul>
     */


    /**
     * Loads a new JSON packet from a URL
     * @method load
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>dataurl</b> - The URL to read the JSON from</li>
</ul>
     */


    /**
     * Modifies any part of the current graph.
     * @method modify
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>data</b> - The JSON packet to apply to the graph.  It will be merged with the previous JSON.</li>
<li><b>object</b> - Optional shortcut to only modify specific parts of the graph.  The options are title, plotset, and legend.</li>
</ul>
     */


    /**
     * Modifies an exisiting plot
     * @method modifyplot
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph.  The default is 0.</li>
<li><b>plotindex</b> - The index of the plot.</li>
<li><b>plotdata</b> - The JSON string that would be set in the series section of the JSON for the individual plot.</li>
</ul>
     */


    /**
     * Reloads the current graph
     * @method reload
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Removes a node
     * @method removenode
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>plotindex</b> - The index of the plot to remove the data from</li>
<li><b>nodeindex</b> - The index of the node to be removed. The values will be shifted.</li>
</ul>
     */


    /**
     * Removes a plot
     * @method removeplot
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph.  The default is 0.</li>
<li><b>plotindex</b> - The index of the plot to be removed.</li>
</ul>
     */


    /**
     * Takes a full JSON packet to replace the current one.
     * @method setdata
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>data</b> - A string of the JSON packet to substitute</li>
</ul>
     */


    /**
     * Changes the value on a single node
     * @method setnodevalue
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>plotindex</b> - The index of the plot.</li>
<li><b>nodeindex</b> - The index of the node to replace</li>
<li><b>value</b> - The new value</li>
</ul>
     */


    /**
     * Returns the entire JSON.
     * @method getdata
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Returns the number of graphs in the chart.
     * @method getgraphlength
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Returns the number of nodes in a given plot.
     * @method getnodelength
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>plotindex</b> - The index of the plot.</li>
</ul>
     */


    /**
     * Returns the value of the given node.
     * @method getnodevalue
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>plotindex</b> - The index of the plot.</li>
<li><b>nodeindex</b> - The index in the specified plot of the node.</li>
</ul>
     */


    /**
     * Returns the number of plots in a given graph.
     * @method getplotlength
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - the index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Returns the value of the given plot.
     * @method getplotvalues
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - the index of the graph. The default is 0.</li>
<li><b>plotindex</b> - The index of the plot.</li>
</ul>
     */


    /**
     * Returns the version number of ZingChart
     * @method showversion
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Turns on the ability to add node to the selected plot through clicking on the graph.
     * @method addnodeia
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>size</b> - In the case of a bubble graph, size indicates the size of the added nodes.</li>
</ul>
     */


    /**
     * Turns on interactive mode and allows the selection of a node or plot by clicking on it.
     * @method entereditmode
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Deselects the previously selected plot or node when in interactive mode and exits interactive mode.
     * @method exiteditmode
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Removes a node selected in interactive mode.
     * @method removenodeia
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Removes a plot selected in interactive mode.
     * @method removeplotia
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Maximizes the legend.
     * @method legendmaximize
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Minimizes the legend.
     * @method legendminimize
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Hides a plot
     * @method plothide
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>plotindex</b> - The index of the plot to be hidden.</li>
</ul>
     */


    /**
     * Shows a plot
     * @method plotshow
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>plotindex</b> - The index of the plot to be displayed</li>
</ul>
     */


    /**
     * Toggles the About Screen.
     * @method toggleabout
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Toggles the Bug Report Screen.
     * @method togglebugreport
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Toggles the Dimension of the current graph between 2D and 3D if possible.
     * @method toggledimension
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Toggles the visiblity of the legend.
     * @method togglelegend
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Toggles the visibility of the lens.
     * @method togglelens
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Toggles the View Source Screen.
     * @method togglesource
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Zooms in the graph
     * @method zoomin
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>zoomx</b> - Boolean indicating to zoom on the x scale</li>
<li><b>zoomy</b> -  - Boolean indicated to zoom on the y scale</li>
</ul>
     */


    /**
     * Zooms out the graph
     * @method zoomout
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>zoomx</b> - <br></li>
      <strong>zoomy</strong>
</ul>
     */


    /**
     * Zooms to a specific area in a graph
     * @method zoomto
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>xmin</b> - The min x position to zoom to</li>
<li><b>xmax</b> - The max x position to zoom to</li>
<li><b>ymin</b> - The min y position to zoom to</li>
<li><b>ymax</b> - the max y position to zoom to</li>
</ul>
     */


    /**
     * Clears the current graph and restarts the feed.
     * @method clearfeed
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Returns the interval value set on the feed.
     * @method getinterval
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
</ul>
     */


    /**
     * Sets the feed interval on a feed graph.
     * @method setinterval
     * @param {Object} params JSON object with the following keys:
     *
<ul><li><b>graphid</b> - The index of the graph. The default is 0.</li>
<li><b>interval</b> - Time of the feed interval set in seconds or milliseconds.</li>
</ul>
     */


    /**
     * Starts the feed.
     * @method startfeed
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Stops the feed.
     * @method stopfeed
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Goes to the previous page in the chart history.
     * @method goback
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Goes forward one page in the chart history.
     * @method goforward
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Exports the current data. Only works if exportdataurl is set in zingchart.render
     * @method exportdata
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Prints the current graph
     * @method print
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */


    /**
     * Produces an image of the graph. Only works if exportimageurl is set in zingchart.render
     * @method saveasimage
     * @param {Object} params JSON object with the following keys:
     *
<ul>
N/A
</ul>
     */

    function getContentTarget(o) {
        return isTouch ? o.getTargetEl() : o.getContentTarget();
    }

    var getRoleFor = ExtX.ZingChart.getRoleFor = function (baseClass) {
        var res = Ext.apply({}, methods);
        return Ext.apply(res, {
            hideMode: 'offsets',
            /**
             * @cfg String output
             * Can be either 'flash' or 'canvas', which will make this chart instance to use according rendering engine. Defaults to the value of the {@link ExtX.ZingChart#output ExtX.ZingChart.output} property.
             */
            output: null,

            /**
             * @cfg Object data
             * A JSON object, containing the description of the chart. For the format description, please refer to the: <a href="http://www.zingchart.com/learn/">ZingChart documentation</a>
             */
            data: null,

            /**
             * @cfg String dataurl
             * A URL, a GET request to which should return a JSON packet, describing the chart
             */
            dataurl: null,

            flashVars: null,

            /**
             * @cfg String defaultsurl
             * A URL, a GET request to which should return a JSON packet, describing the chart default style
             */
            defaultsurl: null,

            /**
             * @cfg Object defaults
             * A JSON object, containing the description of the chart default style
             */
            defaults: null,

            /**
             * @cfg String mode
             * "static" option only, creates a more flattened version of the chart, with the dynamic features disabled
             */
            mode: null,

            /**
             * @cfg String wmode
             * A value of the 'wmode' parameter for the &lt;object&gt; tag.
             */
            wmode: 'opaque',

            flashContainerID: null,

            /**
             * @property ready
             * @type Number
             *
             * This property can be used to determine whether the chart has been already loaded. It will be set to 'true' after the 'load' event has been fired.
             */
            ready: false,

            initComponent: function () {
				var me = this;
				this.monitorOrientation = true;
                this.addEvents.apply(this, events);
                this.output = this.output || ExtX.ZingChart.output;
                baseClass.prototype.initComponent.call(this);
                this.on('afterlayout', this.onFirstLayout, this, { single : true });
                this.on('load', this.onLoad, this);
				// added by mschwartz to handle resize event
				this.on('resize', function(c, w, h) {
					if (typeof(me.__initComponent__) != 'undefined') {
						zingchart.exec(me.flashContainerID, 'resize', { width: me.getWidth(), height: me.getHeight() });
					} else {
						me.__initComponent__ = true;
					}
				});
				// this should handle resize of the chart on orientation change
				this.on('orientationchange', function(me, orientation, w, h) {
					if (me.ready) {
						zingchart.exec(me.flashContainerID, 'resize', { width: me.getWidth(), height: me.getHeight() });
					}
				});

            },


            onLoad: function () {
                this.ready = true;
            },


            onRender: function (ct, position) {
                baseClass.prototype.onRender.call(this, ct, position);
                this.flashContainerID = getContentTarget(this).createChild({}).id;
            },

            onFirstLayout: function () {
            	var me = this;
            	// we really have to let Ext do the layout and move around our components
            	// so defer it for at least 10ms
            	// (effectively a setTimeout kind of thing)
            	Ext.util.Functions.defer(function() {
	                var chartID     = me.flashContainerID;
	                var contentEl   = getContentTarget(me);
	                zingchart.render({
	                    dataurl: me.dataurl,
	                    data: me.data && Ext.encode(me.prepareData(me.data)),
	                    id: chartID,
	                    output: me.output,
	                    width: contentEl.getWidth(),
	                    height: contentEl.getHeight(),
	                    defaultsurl: me.defaultsurl,
						defaults: me.defaults,
	                    wmode: me.wmode,
	                    mode: me.mode,
	                    /*'auto-resize': true,*/
	                    flashvars: me.flashvars || {
	                        allowlocal: 0
	                    }
	                });

	                registry[chartID] = me;
					me.un('afterlayout', me.onFirstLayout, me);
	                me.on('afterlayout', me.onAfterLayout, me);
            	}, 10);
            },


            onAfterLayout: function () {
                var contentEl = getContentTarget(this);
                Ext.get(this.flashContainerID).setSize(contentEl.getSize());
            },


            prepareData: function (data) {
                Ext.each(data.graphset, function (graphset) {
                    Ext.each(graphset.series, function (series) {
                        if (series.values && series.store) {
                            throw "Can't provide both 'values' and 'store' for series [" + Ext.encode(series) + "] in graphset [" + Ext.encode(graphset) + "]";
                        }
                        if (!series.values && !series.store) {
                            throw "Should provide either 'values' or 'store' for series [" + Ext.encode(series) + "] in graphset [" + Ext.encode(graphset) + "]";
                        }
                        if (series.values) {
                            return;
                        }
                        var values = series.values = [];
                        var xField = series.xField;
                        var yField = series.yField || 'value';

                        series.store.each(function (record) {
                            if (series.converter) {
                                var res = series.converter(record, series.store.indexOf(record));
                                values.push(res);
                                return;
                            }
                            if (xField) {
                                values.push( [ record.get(xField), record.get(yField) ] );
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


            destroy: function () {
            	/* added by A.Z. on 29.03.2011 */
            	this.zcdestroy();

                delete registry[ this.flashContainerID ];
                baseClass.prototype.destroy.apply(this, arguments);
            },


            /**
             * This is a thing wrapper around the 'setdata' method, which allows you to omit the external "{ data : ... }" key of the JSON object:
             * <pre>chart.setData({ series : [ ... ]})</pre>
             *
             * @param {Object} params Data to set in the chart
             */
            setData: function (data) {
                this.setdata({
                    data: this.prepareData(data)
                });
            }/*,
			setdata: function(data) {
				this.setdata({
					data: this.prepareData(data)
				});
			}*/
        });
    };


    ExtX.ZingChart.Container = Ext.extend(Ext.Container, getRoleFor(Ext.Container));
    ExtX.ZingChart.Panel = Ext.extend(Ext.Panel, getRoleFor(Ext.Panel));
    if (!isTouch) {
        ExtX.ZingChart.Window = Ext.extend(Ext.Window, getRoleFor(Ext.Window));
    }

    Ext.reg('ExtX.ZingChart.Container', ExtX.ZingChart.Container);
    Ext.reg('ExtX.ZingChart.Panel', ExtX.ZingChart.Panel);
    if (!isTouch) {
        Ext.reg('ExtX.ZingChart.Window', ExtX.ZingChart.Window);
    }

    /**
     * @namespace ExtX
     * @class ExtX.ZingChart
     *
     * This namespace contains some global static settings. You can assign them as:
<pre>
    ExtX.ZingChart.output = 'canvas'
</pre>
     */

    /**
     * @property output
     * @type String
     * Specifies the default rendering engine. Can be either 'flash' or 'canvas', default is 'flash'
     */
    ExtX.ZingChart.output = isTouch ? 'canvas' : 'flash';

}());
