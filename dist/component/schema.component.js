System.register(['@angular/core', '@angular/common', './objectRenderer.component', './../service/globalEvent.service', './../service/asset.service', './../utils'], function(exports_1, context_1) {
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
    var core_1, common_1, objectRenderer_component_1, globalEvent_service_1, asset_service_1, Utils;
    var SchemaComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (objectRenderer_component_1_1) {
                objectRenderer_component_1 = objectRenderer_component_1_1;
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
            SchemaComponent = (function () {
                function SchemaComponent(_assetService, _globalEventService) {
                    this._originalSchema = null; // Copy of the original schema so we can watch for changes
                    this._assetService = _assetService;
                    this._globalEventService = _globalEventService;
                }
                SchemaComponent.prototype.ngOnInit = function () {
                    if (this._originalSchema === null) {
                        this._originalSchema = jQuery.extend(true, {}, this.schemaObject);
                    }
                };
                SchemaComponent.prototype.ngDoCheck = function () {
                    if (!Utils.looseEquals(this.schemaObject, this._originalSchema)) {
                        // Update schema copy
                        this._originalSchema = jQuery.extend(true, {}, this.schemaObject);
                        // Brodacast that the schema has changed
                        this._globalEventService.brodcast(globalEvent_service_1.GlobalEvent.SCHEMA_CHANGE);
                    }
                };
                SchemaComponent.prototype.saveSchema = function () {
                    this._assetService.writeProjectFile();
                    this._assetService.loadLastProject();
                };
                __decorate([
                    // Copy of the original schema so we can watch for changes
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SchemaComponent.prototype, "schemaObject", void 0);
                SchemaComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-schema',
                        directives: [objectRenderer_component_1.ObjectRendererComponent, common_1.NgFor, common_1.NgIf],
                        templateUrl: './app/templates/assess-schema.html'
                    }),
                    __param(0, core_1.Inject(asset_service_1.AssetService)),
                    __param(1, core_1.Inject(globalEvent_service_1.GlobalEventService)), 
                    __metadata('design:paramtypes', [asset_service_1.AssetService, globalEvent_service_1.GlobalEventService])
                ], SchemaComponent);
                return SchemaComponent;
            }());
            exports_1("SchemaComponent", SchemaComponent);
        }
    }
});
//# sourceMappingURL=schema.component.js.map