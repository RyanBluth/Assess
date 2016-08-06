System.register(['@angular/core', './../service/globalEvent.service'], function(exports_1, context_1) {
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
    var core_1, globalEvent_service_1;
    var ConsoleComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (globalEvent_service_1_1) {
                globalEvent_service_1 = globalEvent_service_1_1;
            }],
        execute: function() {
            ConsoleComponent = (function () {
                function ConsoleComponent(_globalEventService, _ref, _zone) {
                    var _this = this;
                    this._lastResize = 0;
                    this.messages = []; // Object format = { text:'some text', severity: 'ERROR, INFO'}
                    this._ref = _ref.nativeElement;
                    this._globlaEventService = _globalEventService;
                    this._zone = _zone;
                    this._globlaEventService.subscribe(globalEvent_service_1.GlobalEvent.ERROR_MESSAGE, function (data) {
                        _this.messages.push({
                            text: _this.formatTimeStamp(data.time) + " - " + data.text,
                            severity: ConsoleComponent.ERROR
                        });
                    });
                    this._globlaEventService.subscribe(globalEvent_service_1.GlobalEvent.INFO_MESSAGE, function (data) {
                        _this.messages.push({
                            text: _this.formatTimeStamp(data.time) + " - " + data.text,
                            severity: ConsoleComponent.INFO
                        });
                    });
                }
                ConsoleComponent.prototype.updateConsoleSize = function (event) {
                    var _this = this;
                    this._zone.runOutsideAngular(function () {
                        var now = Date.now();
                        if (now - _this._lastResize > 33 && event.screenY > 0) {
                            _this._ref.children[0].style.height = screen.height - event.screenY - 40 + "px";
                            _this._lastResize = now;
                        }
                    });
                };
                ConsoleComponent.prototype.formatTimeStamp = function (date) {
                    var m = date.getMinutes().toString();
                    m = m.length == 1 ? "0" + m : m;
                    var s = date.getSeconds().toString();
                    s = s.length == 1 ? "0" + s : s;
                    return date.getHours() + ":" + m + ":" + s;
                };
                ConsoleComponent.ERROR = "error";
                ConsoleComponent.INFO = "info";
                ConsoleComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-console',
                        templateUrl: './app/templates/assess-console.html'
                    }),
                    __param(0, core_1.Inject(globalEvent_service_1.GlobalEventService)), 
                    __metadata('design:paramtypes', [globalEvent_service_1.GlobalEventService, core_1.ElementRef, core_1.NgZone])
                ], ConsoleComponent);
                return ConsoleComponent;
            }());
            exports_1("ConsoleComponent", ConsoleComponent);
        }
    }
});
//# sourceMappingURL=console.component.js.map