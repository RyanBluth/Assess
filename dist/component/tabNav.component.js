System.register(['@angular/core', '@angular/common'], function(exports_1, context_1) {
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
    var core_1, common_1;
    var TabNavComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            TabNavComponent = (function () {
                function TabNavComponent() {
                }
                TabNavComponent.prototype.ngOnInit = function () {
                    if (this.tabs.length > 0) {
                        this.select(this.tabs[0]);
                    }
                };
                TabNavComponent.prototype.select = function (tab) {
                    this.tabs.forEach(function (tab) {
                        tab['isSelected'] = false;
                    });
                    tab['isSelected'] = true;
                    tab.click();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], TabNavComponent.prototype, "tabs", void 0);
                TabNavComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-tab-nav',
                        templateUrl: './app/templates/assess-tab-nav.html',
                        directives: [common_1.NgFor]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TabNavComponent);
                return TabNavComponent;
            }());
            exports_1("TabNavComponent", TabNavComponent);
        }
    }
});
//# sourceMappingURL=tabNav.component.js.map