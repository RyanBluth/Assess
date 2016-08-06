System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1;
    var GlobalEvent, GlobalEventService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            (function (GlobalEvent) {
                GlobalEvent[GlobalEvent["GLOBAL_CLICK"] = 0] = "GLOBAL_CLICK";
                GlobalEvent[GlobalEvent["SCHEMA_CHANGE"] = 1] = "SCHEMA_CHANGE";
                GlobalEvent[GlobalEvent["ERROR_MESSAGE"] = 2] = "ERROR_MESSAGE";
                GlobalEvent[GlobalEvent["INFO_MESSAGE"] = 3] = "INFO_MESSAGE";
            })(GlobalEvent || (GlobalEvent = {}));
            exports_1("GlobalEvent", GlobalEvent);
            GlobalEventService = (function () {
                function GlobalEventService(_zone) {
                    this._emitters = {
                        "GLOBAL_CLICK": new core_1.EventEmitter(),
                        "SCHEMA_CHANGE": new core_1.EventEmitter(),
                        "ERROR_MESSAGE": new core_1.EventEmitter(),
                        "INFO_MESSAGE": new core_1.EventEmitter(),
                    };
                    this._zone = _zone;
                }
                GlobalEventService.prototype.hookupAppElement = function (app) {
                    var _this = this;
                    this._elemRef = app.getElement();
                    this._elemRef.onclick = function (e) {
                        _this._zone.run(function () {
                            _this._emitters[GlobalEvent[GlobalEvent.GLOBAL_CLICK]].emit(e);
                        });
                    };
                };
                GlobalEventService.prototype.subscribe = function (event, func) {
                    this._emitters[GlobalEvent[event]].subscribe(func);
                };
                GlobalEventService.prototype.brodcast = function (event, data) {
                    var _this = this;
                    if (data === void 0) { data = null; }
                    this._zone.run(function () {
                        _this._emitters[GlobalEvent[event]].emit(data);
                    });
                };
                GlobalEventService = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject(core_1.NgZone)), 
                    __metadata('design:paramtypes', [core_1.NgZone])
                ], GlobalEventService);
                return GlobalEventService;
            }());
            exports_1("GlobalEventService", GlobalEventService);
        }
    }
});
//# sourceMappingURL=globalEvent.service.js.map