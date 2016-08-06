System.register(['@angular/platform-browser-dynamic', './component/app.component', './service/project.service', './service/globalEvent.service', './service/asset.service', './utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, app_component_1, project_service_1, globalEvent_service_1, asset_service_1, Utils;
    var globalAppInjector;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (project_service_1_1) {
                project_service_1 = project_service_1_1;
            },
            function (globalEvent_service_1_1) {
                globalEvent_service_1 = globalEvent_service_1_1;
            },
            function (asset_service_1_1) {
                asset_service_1 = asset_service_1_1;
            },
            function (Utils_1) {
                Utils = Utils_1;
            }],
        execute: function() {
            exports_1("globalAppInjector", globalAppInjector = null);
            platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [asset_service_1.AssetService, project_service_1.ProjectService, globalEvent_service_1.GlobalEventService])
                .then(function (appRef) {
                exports_1("globalAppInjector", globalAppInjector = appRef.injector);
                appRef.instance.initialize();
                var log = console.log;
                var error = console.error;
                console.log = function (m) {
                    Utils.logInfo(m);
                    log.apply(console, [m]);
                };
                console.error = function (m) {
                    Utils.logError(m);
                    error.apply(console, [m]);
                };
            });
        }
    }
});
//# sourceMappingURL=bootstrap.js.map