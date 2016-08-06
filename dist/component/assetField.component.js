System.register(['@angular/core', './../assetType', './../service/project.service', './../service/asset.service', './../project'], function(exports_1, context_1) {
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
    var core_1, Assets, project_service_1, asset_service_1, project_1;
    var fs, AssetFieldComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Assets_1) {
                Assets = Assets_1;
            },
            function (project_service_1_1) {
                project_service_1 = project_service_1_1;
            },
            function (asset_service_1_1) {
                asset_service_1 = asset_service_1_1;
            },
            function (project_1_1) {
                project_1 = project_1_1;
            }],
        execute: function() {
            fs = require('fs');
            AssetFieldComponent = (function () {
                function AssetFieldComponent(_zone, _elem, _assetService, _projectService) {
                    this._innerHtml = "";
                    this._elem = _elem.nativeElement;
                    this._assetService = _assetService;
                    this._zone = _zone;
                    this._projectService = _projectService;
                }
                AssetFieldComponent.prototype.ngOnChanges = function () {
                    this._elem.innerHTML = this.field.create.template();
                };
                AssetFieldComponent.prototype.ngAfterViewChecked = function () {
                    var _this = this;
                    this.field.create.setup(this._elem, function (value) { _this.updateValue(value); });
                };
                AssetFieldComponent.prototype.updateValue = function (value) {
                    var _this = this;
                    this._zone.run(function () {
                        var isFileValue = false;
                        try {
                            fs.accessSync(value, fs.R_OK); // Check for file access
                            isFileValue = true;
                        }
                        catch (ignored) { }
                        _this.field.value = value;
                        if (isFileValue) {
                            _this.field.value = _this._projectService.resolveRelativeAssetFilePath(value);
                        }
                        _this.field.refresh();
                        _this._assetService.writeAssets(project_1.AssetWriteFormat.JSON);
                        _this.ngOnChanges();
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Assets.AssetField)
                ], AssetFieldComponent.prototype, "field", void 0);
                AssetFieldComponent = __decorate([
                    core_1.Component({
                        selector: '[asses-asset-field]',
                        template: '<div class="asset-field"></div>'
                    }),
                    __param(2, core_1.Inject(asset_service_1.AssetService)),
                    __param(3, core_1.Inject(project_service_1.ProjectService)), 
                    __metadata('design:paramtypes', [core_1.NgZone, core_1.ElementRef, asset_service_1.AssetService, Object])
                ], AssetFieldComponent);
                return AssetFieldComponent;
            }());
            exports_1("AssetFieldComponent", AssetFieldComponent);
        }
    }
});
//# sourceMappingURL=assetField.component.js.map