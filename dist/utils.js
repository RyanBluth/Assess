System.register(["./bootstrap", './service/globalEvent.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var bootstrap_1, globalEvent_service_1;
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
        var eventService = bootstrap_1.globalAppInjector.get(globalEvent_service_1.GlobalEventService);
        eventService.brodcast(globalEvent_service_1.GlobalEvent.ERROR_MESSAGE, { text: message, time: new Date() });
    }
    exports_1("logError", logError);
    function logInfo(message) {
        var eventService = bootstrap_1.globalAppInjector.get(globalEvent_service_1.GlobalEventService);
        eventService.brodcast(globalEvent_service_1.GlobalEvent.INFO_MESSAGE, { text: message, time: new Date() });
    }
    exports_1("logInfo", logInfo);
    function looseEquals(a, b) {
        var aArr = Array.isArray(a);
        var bArr = Array.isArray(b);
        if (aArr != bArr) {
            return false;
        }
        var aObj = a instanceof Object;
        var bObj = b instanceof Object;
        if (aObj != bObj) {
            return false;
        }
        if (aArr) {
            if (a.length != b.length) {
                return false;
            }
            for (var i = 0; i < a.length; ++i) {
                if (!looseEquals(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        else if (aObj) {
            for (var p in a) {
                if (!b.hasOwnProperty(p) || !looseEquals(a[p], b[p])) {
                    return false;
                }
            }
            return true;
        }
        else {
            return a == b;
        }
    }
    exports_1("looseEquals", looseEquals);
    return {
        setters:[
            function (bootstrap_1_1) {
                bootstrap_1 = bootstrap_1_1;
            },
            function (globalEvent_service_1_1) {
                globalEvent_service_1 = globalEvent_service_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=utils.js.map