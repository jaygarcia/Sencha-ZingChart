Ext.define('Ext.ux.zingchart.Chart', {
    extend : 'Ext.Component',
    mixins : {
        'chartbase' : 'Ext.ux.zingchart.ChartBase'
    },
    initComponent : function() {
        var me = this;
        me.mixins.chartbase.initComponent.apply(this);
        me.callParent();
    }
});