System.register(['@angular/core', '@angular/common', './../service/globalEvent.service'], function(exports_1, context_1) {
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
    var core_1, common_1, globalEvent_service_1;
    var PopupOption, PopupComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (globalEvent_service_1_1) {
                globalEvent_service_1 = globalEvent_service_1_1;
            }],
        execute: function() {
            PopupOption = (function () {
                function PopupOption(label, onClick) {
                    this.label = label;
                    this.onClick = onClick;
                }
                return PopupOption;
            }());
            exports_1("PopupOption", PopupOption);
            PopupComponent = (function () {
                function PopupComponent(globalEventService) {
                    var _this = this;
                    this.hidden = true;
                    globalEventService.subscribe(globalEvent_service_1.GlobalEvent.GLOBAL_CLICK, function (event) {
                        if (!_this.hidden) {
                            _this.toggleHidden();
                        }
                    });
                }
                PopupComponent.prototype.clickOption = function (option) {
                    option.onClick();
                    this.toggleHidden();
                };
                PopupComponent.prototype.toggleHidden = function () {
                    this.hidden = !this.hidden;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], PopupComponent.prototype, "options", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], PopupComponent.prototype, "icon", void 0);
                PopupComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-popup',
                        templateUrl: './app/templates/assess-popup.html',
                        directives: [common_1.NgFor, common_1.NgIf]
                    }),
                    __param(0, core_1.Inject(globalEvent_service_1.GlobalEventService)), 
                    __metadata('design:paramtypes', [globalEvent_service_1.GlobalEventService])
                ], PopupComponent);
                return PopupComponent;
            }());
            exports_1("PopupComponent", PopupComponent);
        }
    }
});
//# sourceMappingURL=popup.component.js.map