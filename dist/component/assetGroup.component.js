System.register(['@angular/core', '@angular/common', './../service/asset.service', './asset.component', './assetHeader.component'], function(exports_1, context_1) {
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
    var core_1, common_1, asset_service_1, asset_component_1, assetHeader_component_1;
    var AssetGroupComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (asset_service_1_1) {
                asset_service_1 = asset_service_1_1;
            },
            function (asset_component_1_1) {
                asset_component_1 = asset_component_1_1;
            },
            function (assetHeader_component_1_1) {
                assetHeader_component_1 = assetHeader_component_1_1;
            }],
        execute: function() {
            AssetGroupComponent = (function () {
                function AssetGroupComponent(assetService) {
                    this.assetService = assetService;
                }
                AssetGroupComponent.prototype.ngAfterViewChecked = function () {
                    jQuery("table").colResizable({ liveDrag: true });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], AssetGroupComponent.prototype, "assetGroup", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], AssetGroupComponent.prototype, "assetGroupName", void 0);
                AssetGroupComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-asset-group',
                        directives: [asset_component_1.AssetComponent, assetHeader_component_1.AssetHeaderComponent, common_1.NgFor, common_1.NgIf],
                        templateUrl: './app/templates/assess-asset-group.html'
                    }),
                    __param(0, core_1.Inject(asset_service_1.AssetService)), 
                    __metadata('design:paramtypes', [asset_service_1.AssetService])
                ], AssetGroupComponent);
                return AssetGroupComponent;
            }());
            exports_1("AssetGroupComponent", AssetGroupComponent);
        }
    }
});
//# sourceMappingURL=assetGroup.component.js.map