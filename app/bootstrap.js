System.register(['angular2/platform/browser', './app.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, Components;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (Components_1) {
                Components = Components_1;
            }],
        execute: function() {
            browser_1.bootstrap(Components.AppComponent);
            browser_1.bootstrap(Components.AssetGroupComponent);
        }
    }
});
//# sourceMappingURL=bootstrap.js.map