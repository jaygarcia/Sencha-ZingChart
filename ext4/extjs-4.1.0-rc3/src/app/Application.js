/**
 * Represents an Ext JS 4 application, which is typically a single page app using a {@link Ext.container.Viewport Viewport}.
 * A typical Ext.app.Application might look like this:
 * 
 *     Ext.application({
 *         name: 'MyApp',
 *         launch: function() {
 *             Ext.create('Ext.container.Viewport', {
 *                 items: {
 *                     html: 'My App'
 *                 }
 *             });
 *         }
 *     });
 * 
 * This does several things. First it creates a global variable called 'MyApp' - all of your Application's classes (such
 * as its Models, Views and Controllers) will reside under this single namespace, which drastically lowers the chances
 * of colliding global variables.
 * 
 * When the page is ready and all of your JavaScript has loaded, your Application's {@link #launch} function is called,
 * at which time you can run the code that starts your app. Usually this consists of creating a Viewport, as we do in
 * the example above.
 * 
 * # Telling Application about the rest of the app
 * 
 * Because an Ext.app.Application represents an entire app, we should tell it about the other parts of the app - namely
 * the Models, Views and Controllers that are bundled with the application. Let's say we have a blog management app; we
 * might have Models and Controllers for Posts and Comments, and Views for listing, adding and editing Posts and Comments.
 * Here's how we'd tell our Application about all these things:
 * 
 *     Ext.application({
 *         name: 'Blog',
 *         models: ['Post', 'Comment'],
 *         controllers: ['Posts', 'Comments'],
 *     
 *         launch: function() {
 *             ...
 *         }
 *     });
 * 
 * Note that we didn't actually list the Views directly in the Application itself. This is because Views are managed by
 * Controllers, so it makes sense to keep those dependencies there. The Application will load each of the specified 
 * Controllers using the pathing conventions laid out in the [application architecture guide][mvc] - in this case
 * expecting the controllers to reside in app/controller/Posts.js and app/controller/Comments.js. In turn, each
 * Controller simply needs to list the Views it uses and they will be automatically loaded. Here's how our Posts
 * controller like be defined:
 * 
 *     Ext.define('MyApp.controller.Posts', {
 *         extend: 'Ext.app.Controller',
 *         views: ['posts.List', 'posts.Edit'],
 *     
 *         //the rest of the Controller here
 *     });
 * 
 * Because we told our Application about our Models and Controllers, and our Controllers about their Views, Ext JS will
 * automatically load all of our app files for us. This means we don't have to manually add script tags into our html
 * files whenever we add a new class, but more importantly it enables us to create a minimized build of our entire 
 * application using the Ext JS 4 SDK Tools.
 *
 * For more information about writing Ext JS 4 applications, please see the [application architecture guide][mvc].
 *
 * [mvc]: #/guide/application_architecture
 * 
 * @docauthor Ed Spencer
 */
Ext.define('Ext.app.Application', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.ModelManager',
        'Ext.data.Model',
        'Ext.data.StoreManager',
        'Ext.tip.QuickTipManager',
        'Ext.ComponentManager',
        'Ext.app.EventBus'
    ],

    /**
     * @cfg {String} name
     * The name of your application. This will also be the namespace for your views, controllers
     * models and stores. Don't use spaces or special characters in the name.
     */
    
    /**
     * @cfg {String[]} controllers
     * Names of controllers that the app uses.
     */

    /**
     * @cfg {Object} scope
     * The scope to execute the {@link #launch} function in. Defaults to the Application instance.
     */
    scope: undefined,

    /**
     * @cfg {Boolean} enableQuickTips
     * True to automatically set up Ext.tip.QuickTip support.
     */
    enableQuickTips: true,

    /**
     * @cfg {String} defaultUrl
     * When the app is first loaded, this url will be redirected to.
     */

    /**
     * @cfg {String} appFolder
     * The path to the directory which contains all application's classes.
     * This path will be registered via {@link Ext.Loader#setPath} for the namespace specified
     * in the {@link #name name} config.
     */
    appFolder: 'app',

    /**
     * @cfg {Boolean} autoCreateViewport
     * True to automatically load and instantiate AppName.view.Viewport before firing the launch function.
     */
    autoCreateViewport: false,

    /**
     * Creates new Application.
     * @param {Object} [config] Config object.
     */
    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);

        var requires = config.requires || [],
            controllers, ln, i, controller,
            paths, path, ns;

        Ext.Loader.setPath(this.name, this.appFolder);

        if (this.paths) {
            paths = this.paths;

            for (ns in paths) {
                if (paths.hasOwnProperty(ns)) {
                    path = paths[ns];

                    Ext.Loader.setPath(ns, path);
                }
            }
        }

        this.callParent(arguments);

        this.eventbus = new Ext.app.EventBus;

        controllers = Ext.Array.from(this.controllers);
        ln = controllers && controllers.length;

        this.controllers = new Ext.util.MixedCollection();

        if (this.autoCreateViewport) {
            requires.push(this.getModuleClassName('Viewport', 'view'));
        }

        for (i = 0; i < ln; i++) {
            requires.push(this.getModuleClassName(controllers[i], 'controller'));
        }

        Ext.require(requires);

        Ext.onReady(function() {
            for (i = 0; i < ln; i++) {
                controller = this.getController(controllers[i]);
                controller.init(this);
            }

            this.onBeforeLaunch.call(this);
        }, this);
    },

    control: function(selectors, listeners, controller) {
        this.eventbus.control(selectors, listeners, controller);
    },

    /**
     * @method
     * @template
     * Called automatically when the page has completely loaded. This is an empty function that should be
     * overridden by each application that needs to take action on page load.
     * @param {String} profile The detected {@link #profiles application profile}
     * @return {Boolean} By default, the Application will dispatch to the configured startup controller and
     * action immediately after running the launch function. Return false to prevent this behavior.
     */
    launch: Ext.emptyFn,

    /**
     * @private
     */
    onBeforeLaunch: function() {
        var me = this,
            controllers, c, cLen, controller;

        if (me.enableQuickTips) {
            Ext.tip.QuickTipManager.init();
        }

        if (me.autoCreateViewport) {
            me.getView('Viewport').create();
        }

        me.launch.call(this.scope || this);
        me.launched = true;
        me.fireEvent('launch', this);

        controllers = me.controllers.items;
        cLen        = controllers.length;

        for (c = 0; c < cLen; c++) {
            controller = controllers[c];
            controller.onLaunch(this);
        }
    },

    getModuleClassName: function(name, namespace) {
        var appName = this.name;
        
        // we check name === appName to allow MyApp.profile.MyApp to exist
        if (Ext.isString(name) && (Ext.Loader.getPrefix(name) === "" || name === appName)) {
            name = appName + '.' + namespace + '.' + name;
        }
        
        return name;
    },

    getController: function(name) {
        var controller = this.controllers.get(name);

        if (!controller) {
            controller = Ext.create(this.getModuleClassName(name, 'controller'), {
                application: this,
                id: name
            });

            this.controllers.add(controller);
        }

        return controller;
    },

    getStore: function(name) {
        var store = Ext.StoreManager.get(name);

        if (!store) {
            store = Ext.create(this.getModuleClassName(name, 'store'), {
                storeId: name
            });
        }

        return store;
    },

    getModel: function(model) {
        model = this.getModuleClassName(model, 'model');

        return Ext.ModelManager.getModel(model);
    },

    getView: function(view) {
        view = this.getModuleClassName(view, 'view');

        return Ext.ClassManager.get(view);
    }
});
