Ext.onReady(function() {
	var flashDemos = [
		{
			title: 'Line Chart',
			html: 'demo1.html',
			js: 'demo1.js'
		},
		{
			title: 'Line Chart - Border Layout',
			html: 'demo2.html',
			js: 'demo2.js'
		},
		{
			title: 'Grid and Store',
			html: 'demo3.html',
			js: 'demo3.js'
		},
		{
			title: 'Form and Chart',
			html: 'demo4.html',
			js: 'demo4.js'
		},
		{
			title: 'Chart in a Window',
			html: 'demo5.html',
			js: 'demo5.js'
		}
	];

	var html5Demos = [
		{
			title: 'Line Chart',
			html: 'demo6.html',
			js: 'demo6.js'
		},
		{
			title: 'Line Chart - Border Layout',
			html: 'demo7.html',
			js: 'demo7.js'
		},
		{
			title: 'Grid and Store',
			html: 'demo8.html',
			js: 'demo8.js'
		},
		{
			title: 'Form and Chart',
			html: 'demo9.html',
			js: 'demo9.js'
		},
		{
			title: 'Chart in a Window',
			html: 'demo10.html',
			js: 'demo10.js'
		},
		{
			title: 'Extended Demo',
			html: 'demo11.html',
			js: 'demo11.js'
		},
		{
			title: 'Memory',
			html: 'demo12.html',
			js: 'demo12.js'
		},
		{
			title: 'Memory (no plugin)',
			html: 'demo13.html',
			js: 'demo13.js'
		}
	];

	var loadMask = null;
	function viewDemo(url, title) {
		var iframe = Ext.getCmp('demo-iframe');
		iframe.setTitle(title);
		loadMask = loadMask || new Ext.LoadMask(iframe.body, { msg: 'Loading...'});
		loadMask.show();
		iframe.setSrc('extjs-demo/'+url, false, function() {
			loadMask.hide();
		});
	}

	function viewSource(url) {
		var iframe = Ext.getCmp('demo-iframe');
		var title = 'Source of extjs-demo/'+url;
		iframe.setTitle(title);
		loadMask = loadMask || new Ext.LoadMask(iframe.body, { msg: 'Loading...'});
		loadMask.show();
		Ext.Ajax.request({
			method: 'GET',
			url: 'extjs-demo/'+url,
			success: function(response) {
				var doc = iframe.iframe.getDocument();
				var html = '<html><head><title>'+title+'</title></head>';
				html += '<body style="background: white;"><pre>' + response.responseText.replace(/</igm, '&lt;').replace(/\t/igm, '    ') + '</body></html>';
				doc.open();
				doc.write(html);
				doc.close();
				loadMask.hide();
			}
		});
	}

	new Ext.Viewport({
		layout: 'border',
		items: [
			{
				region: 'north',
				height: 34,
				border: false,
				bodyBorder: false,
				bodyCssClass: 'x-toolbar',
				bodyStyle: 'padding: 2px; padding-left: 10px; font-size: 25px; font-weight: bold;',
				html: 'ZingChart ExtJS Demos'
			},
			{
				region: 'west',
				width: 200,
				xtype: 'treepanel',
				title: 'Demos',
				rootVisible: true,
				root: new Ext.tree.TreeNode({
					text: 'Home',
					expanded: true,
					listeners: {
						click: function() {
							viewDemo('welcome.html', 'Home');
						}
					}
				}),
				useArrows: true,
				containerScroll: true,
				listeners: {
					render: function() {
						var root = this.root, i, len;
						var flashNode = new Ext.tree.TreeNode({
							leaf: false,
							text: 'Flash Demos',
							expanded: true
						});
						root.appendChild(flashNode);
						for (i=0, len=flashDemos.length; i<len; i++) {
							var demo = flashDemos[i];
							var demoNode = new Ext.tree.TreeNode({
								leaf: false,
								text: demo.title,
								demo: demo,
								expanded: false
							});
							flashNode.appendChild(demoNode);
							demoNode.appendChild(new Ext.tree.TreeNode({
								leaf: true,
								text: 'View Demo',
								demo: demo,
								listeners: {
									click: function() {
										viewDemo(this.attributes.demo.html, 'FLASH ' + this.attributes.demo.title);
									}
								}
							}));
							demoNode.appendChild(new Ext.tree.TreeNode({
								leaf: true,
								text: 'View HTML',
								demo: demo,
								listeners: {
									click: function() {
										viewSource(this.attributes.demo.html);
									}
								}
							}));
							demoNode.appendChild(new Ext.tree.TreeNode({
								leaf: true,
								text: 'View JavaScript',
								demo: demo,
								listeners: {
									click: function() {
										viewSource(this.attributes.demo.js);
									}
								}
							}));
						}

						var html5Node = new Ext.tree.TreeNode({
							leaf: false,
							text: 'HTML5 Demos',
							expanded: true
						});
						root.appendChild(html5Node);
						for (i=0, len=html5Demos.length; i<len; i++) {
							var demo = html5Demos[i];
							var demoNode = new Ext.tree.TreeNode({
								leaf: false,
								text: demo.title,
								demo: demo,
								expanded: false
							});
							html5Node.appendChild(demoNode);
							demoNode.appendChild(new Ext.tree.TreeNode({
								leaf: true,
								text: 'View Demo',
								demo: demo,
								listeners: {
									click: function() {
										viewDemo(this.attributes.demo.html, 'HTML5 ' + this.attributes.demo.title);
									}
								}
							}));
							demoNode.appendChild(new Ext.tree.TreeNode({
								leaf: true,
								text: 'View HTML',
								demo: demo,
								listeners: {
									click: function() {
										viewSource(this.attributes.demo.html);
									}
								}
							}));
							demoNode.appendChild(new Ext.tree.TreeNode({
								leaf: true,
								text: 'View JavaScript',
								demo: demo,
								listeners: {
									click: function() {
										viewSource(this.attributes.demo.js);
									}
								}
							}));
						}
					}
				}
			},
			{
				region: 'center',
				id: 'demo-iframe',
				xtype: 'iframepanel',
				title: 'Demo Area',
				autoScroll: true,
				listeners: {
					render: function() {
						viewDemo('welcome.html', 'Home');
					}
				}
			}
		]
	});
});
