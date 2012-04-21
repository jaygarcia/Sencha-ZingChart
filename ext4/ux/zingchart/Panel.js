Ext.define('Ext.ux.zingchart.Panel', {
    extend : 'Ext.panel.Panel',
    mixins : {
        'chartbase' : 'Ext.ux.zingchart.ChartBase'
    },
    initComponent : function() {
        var me = this;
        me.mixins.chartbase.initComponent.apply(this);
        me.callParent();
    }
});