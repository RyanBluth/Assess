System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function assertHasProperties(obj, fields) {
        var missingProps = [];
        fields.forEach(function (prop) {
            if (!obj.hasOwnProperty(prop)) {
                missingProps.push(prop);
            }
        });
        return missingProps;
    }
    exports_1("assertHasProperties", assertHasProperties);
    function logError(message) {
        console.error(message);
    }
    exports_1("logError", logError);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=utils.js.map