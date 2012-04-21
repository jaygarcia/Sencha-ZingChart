(function() {

    var methodNames = [
        'addnode',
        'addnodeia',
        'addobject',
        'addplot',
        'appendseriesvalues',
        'clear',
        'clearfeed',
        'disable',
        'enable',
        'entereditmode',
        'exiteditmode',
        'exportdata',
        'getdata',
        'getgraphlength',
        'getimagedata',
        'getinterval',
        'getnodelength',
        'getnodevalue',
        'getplotlength',
        'getplotvalues',
        'getrender',
        'getxyinfo',
        'goback',
        'goforward',
        'legendmaximize',
        'legendminimize',
        'load',
        'modify',
        'modifyplot',
        'plothide',
        'plotshow',
        'print',
        'reload',
        'removenode',
        'removenodeia',
        'removeobject',
        'removeplot',
        'removeplotia',
        'resize',
        'saveasimage',
        'setdata',
        'setinterval',
        'setnodevalue',
        'setseriesdata',
        'setseriesvalues',
        'showversion',
        'startfeed',
        'stopfeed',
        'toggleabout',
        'togglebugreport',
        'toggledimension',
        'togglelegend',
        'togglelens',
        'togglesource',
        'updateobject',
        'zcdestroy',
        'zoomin',
        'zoomout',
        'zoomto',
        'zoomtovalues'

    ];

    var events = [
        'about_hide',
        'about_show',
        'bugreport_hide',
        'bugreport_show',
        'click',
        'complete',
        'data_export',
        'dimension_change',
        'feed_clear',
        'feed_interval_modify',
        'feed_start',
        'feed_stop',
        'history_back',
        'history_forward',
        'image_save',
        'label_click',
        'label_mouseout',
        'label_mouseover',
        'legend_hide',
        'legend_item_click',
        'legend_maximize',
        'legend_minimize',
        'legend_show',
        'lens_hide',
        'lens_show',
        'load',
        'modify',
        'node_add',
        'node_click',
        'node_deselect',
        'node_doubleclick',
        'node_modify',
        'node_mouseout',
        'node_mouseover',
        'node_remove',
        'node_select',
        'plot_add',
        'plot_click',
        'plot_deselect',
        'plot_doubleclick',
        'plot_hide',
        'plot_modify',
        'plot_mouseout',
        'plot_mouseover',
        'plot_remove',
        'plot_select',
        'plot_show',
        'print',
        'reload',
        'setdata',
        'shape_click',
        'shape_mouseout',
        'shape_mouseover',
        'source_hide',
        'source_show',
        'zoom'
    ];

    Ext.each(events, function(event) {
        zingchart[ event ] = function(params) {
            var chartID = params && params.id;
            if (!chartID) {
                return;
            }
            var chart = registry[ chartID ];
            if (!chart) {
                return;
            }
            chart.fireEvent(event, chart, params);
        };
    });

    var methods = {};

    Ext.each(methodNames, function(methodName) {
        methods[ methodName ] = function(args) {
            var argsStr = args && Ext.encode(args) || undefined;
            return zingchart.exec(this.flashContainerID, methodName, argsStr);
        };
    });

    var registry = {};

    Ext.define('Ext.ux.zingchart.Methods', methods);
})();