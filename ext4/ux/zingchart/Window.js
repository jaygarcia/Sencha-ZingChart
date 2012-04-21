Ext.define('Ext.ux.zingchart.Window', {
    extend : 'Ext.window.Window',
    mixins : {
        'chartbase' : 'Ext.ux.zingchart.ChartBase'
    },
    initComponent : function() {
        var me = this;
        me.mixins.chartbase.initComponent.apply(this);
        me.callParent();
    }
});