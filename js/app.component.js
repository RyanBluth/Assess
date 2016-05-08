System.register(['angular2/core', 'angular2/common', './assetType', "./utils"], function(exports_1, context_1) {
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
    var core_1, common_1, Assets, utils;
    var fs, electron, currentProjectPath, AS_SchemaTypes, providers, ProjectConfig, AssetWriteFormat, Schema, AssetService, AppComponent, AssetFieldComponent, AssetComponent, AssetHeaderComponent, AssetGroupComponent;
    function loadProject() {
        var data = fs.loadFileSync(currentProjectPath, "utf8");
        data = JSON.parse(data);
        var pc = new ProjectConfig();
        pc.assetsPath = data["assetPath"] || null;
        pc.schemaPath = data["schemaPath"] || null;
        pc.structurePath = data["structurePath"] || null;
        pc.structurePath = data["mappings"] || null;
        return pc;
    }
    exports_1("loadProject", loadProject);
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (Assets_1) {
                Assets = Assets_1;
            },
            function (utils_1) {
                utils = utils_1;
            }],
        execute: function() {
            fs = require('fs');
            electron = require('electron');
            currentProjectPath = null; // Current Project File Path
            AS_SchemaTypes = [
                "AS_ASSETS"
            ];
            providers = {
                assetServiceProvider: core_1.provide(AssetService, {
                    useFactory: function () {
                        // Load project configuration stuff here
                        var pc = new ProjectConfig();
                        pc.assetsPath = "/assets.json";
                        pc.schemaPath = "C:/Projects/Assess/test-schema.json";
                        pc.structurePath = "C:/Projects/Assess/test-structure.json";
                        var assetService = new AssetService(pc);
                        assetService.readAssets("C:/Projects/Assess/assets.json");
                        assetService.writeAssets(AssetWriteFormat.JSON);
                        return assetService;
                    }
                })
            };
            ProjectConfig = (function () {
                function ProjectConfig() {
                }
                return ProjectConfig;
            }());
            exports_1("ProjectConfig", ProjectConfig);
            (function (AssetWriteFormat) {
                AssetWriteFormat[AssetWriteFormat["JSON"] = 0] = "JSON";
            })(AssetWriteFormat || (AssetWriteFormat = {}));
            exports_1("AssetWriteFormat", AssetWriteFormat);
            Schema = (function () {
                function Schema(schemaAsObj, structureStr) {
                    var _this = this;
                    this.assetTypes = {};
                    this.assetTypeNames = [];
                    this.properties = [];
                    this.structureStr = structureStr;
                    this.properties = Object.keys(schemaAsObj);
                    if (schemaAsObj.hasOwnProperty(Assets.SchemaFields[Assets.SchemaFields.AS_ASSETS])) {
                        var at = schemaAsObj[Assets.SchemaFields[Assets.SchemaFields.AS_ASSETS]];
                        if (at instanceof Array) {
                            at.forEach(function (typeDef) {
                                _this.assetTypes[typeDef["type"]] = new Assets.AssetTypeDefinition(typeDef);
                                _this.assetTypeNames.push(typeDef["type"]);
                            });
                        }
                        else {
                            utils.logError("ASSET_TYPES must be an array");
                        }
                    }
                }
                return Schema;
            }());
            exports_1("Schema", Schema);
            AssetService = (function () {
                function AssetService(config) {
                    this.assets = [];
                    if (config) {
                        this.loadProject(config);
                    }
                }
                AssetService.prototype.loadProject = function (config) {
                    // Load schema
                    // populate AssetTypeDefinitions as object keyed by type
                    var data = fs.readFileSync(config.schemaPath, 'utf8');
                    if (!data) {
                        utils.logError("Error reading schema file");
                        return;
                    }
                    var struc = fs.readFileSync(config.structurePath, 'utf8');
                    if (!struc) {
                        utils.logError("Error reading structure file");
                        return;
                    }
                    this.schema = new Schema(JSON.parse(data), struc);
                };
                /**
                 * @brief Adds a new asset to the assets array
                 * @details Constructs the asset based on the type and populates
                 *  its fields with appropreiate default values
                 *
                 * @param type The type of the asset - specified in the schema
                 */
                AssetService.prototype.addAsset = function (type) {
                    // Need to make sure there is a loaded type definition for the specified type
                    if (!this.schema.assetTypes.hasOwnProperty(type)) {
                        utils.logError("Error occured during call to addAsset - type \"" + type + "\" is not specified in the loaded schema");
                        return;
                    }
                    // Creeate a new asset object - passing in the type definition from the schema
                    this.assets.push(new Assets.Asset(this.schema.assetTypes[type]));
                };
                /**
                 * Write the current assets to a file using the specified format
                 * If the outputPasth isn't specied try and load it from the project.json file
                 */
                AssetService.prototype.writeAssets = function (format, outputPath) {
                    var _this = this;
                    var outStructureStr = this.schema.structureStr;
                    // insert AS properties from schema into output assets
                    this.schema.properties.forEach(function (prop) {
                        outStructureStr = outStructureStr.replace(new RegExp('"' + prop + '"', 'i'), _this.retriveValueForSchemaProperty(prop));
                    });
                    fs.writeFileSync("C:/Projects/Assess/assets.json", outStructureStr);
                };
                AssetService.prototype.readAssets = function (inputPath) {
                    var _this = this;
                    var assetsStr = fs.readFileSync(inputPath, 'utf8');
                    var strucToAssetMap = {};
                    var strucObj = JSON.parse(this.schema.structureStr);
                    this.schema.properties.forEach(function (p) {
                        strucToAssetMap[p] = _this.findValueInObject(strucObj, p).reverse();
                    });
                    // @TODO Load custom properties
                    var assetsObj = JSON.parse(assetsStr);
                    var c = null;
                    strucToAssetMap["AS_ASSETS"].forEach(function (p) {
                        if (c == null) {
                            c = assetsObj[p];
                        }
                        else {
                            c = c[p];
                        }
                    });
                    c.forEach(function (asset) {
                        var a = new Assets.Asset(_this.schema.assetTypes[asset.type], asset);
                        _this.assets.push(a);
                    });
                };
                AssetService.prototype.retriveValueForSchemaProperty = function (property) {
                    if (AS_SchemaTypes.indexOf(property) != -1) {
                        switch (property) {
                            case "AS_ASSETS":
                                var outAssets_1 = [];
                                this.assets.forEach(function (asset) {
                                    var outAsset = {};
                                    outAsset["type"] = asset.definition.type;
                                    for (var key in asset.fields) {
                                        outAsset[key] = asset.fields[key].value;
                                    }
                                    outAssets_1.push(outAsset);
                                });
                                return JSON.stringify(outAssets_1, null, "\t");
                        }
                    }
                    else {
                        // @TODO Retrive custom properties
                        return '"DDDDDD"';
                    }
                    return "";
                };
                AssetService.prototype.findValueInObject = function (obj, property, path) {
                    if (path === void 0) { path = []; }
                    for (var x in obj) {
                        ;
                        var val = obj[x];
                        if (val == property) {
                            path.push(x);
                            return path;
                        }
                        else if (val != null && typeof val == 'object') {
                            var v = this.findValueInObject(val, property, path);
                            if (v != null) {
                                path.push(x);
                                return path;
                            }
                        }
                    }
                    return null;
                };
                AssetService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [ProjectConfig])
                ], AssetService);
                return AssetService;
            }());
            exports_1("AssetService", AssetService);
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-app',
                        template: '<h4>Assess</h4>',
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
            AssetFieldComponent = (function () {
                function AssetFieldComponent(elem, assetService) {
                    this.elem = elem.nativeElement;
                    this.assetService = assetService;
                }
                AssetFieldComponent.prototype.ngAfterViewChecked = function () {
                    var _this = this;
                    this.field.create.setup(this.elem, function (value) { _this.updateValue(value); });
                };
                AssetFieldComponent.prototype.updateValue = function (value) {
                    this.field.value = value;
                    this.assetService.writeAssets(AssetWriteFormat.JSON);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Assets.AssetField)
                ], AssetFieldComponent.prototype, "field", void 0);
                AssetFieldComponent = __decorate([
                    core_1.Component({
                        selector: '[asses-asset-field]',
                        template: '<div class="asset-field" [outerHTML]="field.create.template"></div>',
                    }),
                    __param(1, core_1.Inject(AssetService)), 
                    __metadata('design:paramtypes', [core_1.ElementRef, AssetService])
                ], AssetFieldComponent);
                return AssetFieldComponent;
            }());
            exports_1("AssetFieldComponent", AssetFieldComponent);
            AssetComponent = (function () {
                function AssetComponent() {
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Assets.Asset)
                ], AssetComponent.prototype, "asset", void 0);
                AssetComponent = __decorate([
                    core_1.Component({
                        selector: '[assess-asset]',
                        directives: [AssetFieldComponent],
                        templateUrl: './app/templates/assess-asset.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AssetComponent);
                return AssetComponent;
            }());
            exports_1("AssetComponent", AssetComponent);
            AssetHeaderComponent = (function () {
                function AssetHeaderComponent() {
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Assets.AssetTypeDefinition)
                ], AssetHeaderComponent.prototype, "assetType", void 0);
                AssetHeaderComponent = __decorate([
                    core_1.Component({
                        selector: '[assess-asset-header]',
                        templateUrl: './app/templates/assess-asset-header.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AssetHeaderComponent);
                return AssetHeaderComponent;
            }());
            exports_1("AssetHeaderComponent", AssetHeaderComponent);
            AssetGroupComponent = (function () {
                function AssetGroupComponent(assetService) {
                    this.assetService = assetService;
                }
                AssetGroupComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-asset-group',
                        directives: [AssetComponent, AssetHeaderComponent, common_1.NgFor],
                        template: "\n    \t\t<table class=\"asset-group-table\" cellpadding=0 cellspacing=0>\n    \t\t\t<thead>\n\t    \t\t\t<tr assess-asset-header *ngFor=\"#assetTypeName of assetService.schema.assetTypeNames\" \n\t    \t\t\t\t[assetType]=\"assetService.schema.assetTypes[assetTypeName]\"></tr>\n    \t\t\t</thead>\n    \t\t\t<tbody>\n\t    \t\t\t<tr assess-asset *ngFor=\"#asset of assetService.assets\" [asset]=\"asset\"></tr>\n\t    \t\t</tbody>\n    \t\t</table>",
                        providers: [
                            core_1.provide(AssetService, providers.assetServiceProvider)
                        ]
                    }),
                    __param(0, core_1.Inject(AssetService)), 
                    __metadata('design:paramtypes', [AssetService])
                ], AssetGroupComponent);
                return AssetGroupComponent;
            }());
            exports_1("AssetGroupComponent", AssetGroupComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map