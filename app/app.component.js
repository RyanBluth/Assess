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
    var fs, electron, ProjectConfig, AssetWriteFormat, Schema, AssetService, AppComponent, AssetComponent, AssetGroupComponent;
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
            /**
             * @brief Defines the structure of the asset strore and its data types
             *
             * The following attributes may be specifed
             * ASSET_TYPES - An array specifing the asset types and their formats. An example would be as follows
             * "ASSET_TYPES": [
             *   {
             *     "name": "Image",
             *     "type": "IMAGE",
             *     "fields": [
             *       {
             *         "dataType": "AS_FILE",
             *         "name": "src",
             *         "extensions": [
             *           "png",
             *           "jpg",
             *           "gif"
             *         ],
             *         "loader": "loaders/imageLoader.js"
             *       },
             *       {
             *         "dataType": "AS_STRING",
             *         "name": "Description",
             *         "loader": "loaders/imageLoader.js"
             *       }
             *     ]
             *   }
             * ]
             */
            Schema = (function () {
                function Schema(schemaAsObj) {
                    var _this = this;
                    this.assetTypes = {};
                    if (schemaAsObj.hasOwnProperty(Assets.SchemaFields[Assets.SchemaFields.AS_ASSET_TYPES])) {
                        var at = schemaAsObj[Assets.SchemaFields[Assets.SchemaFields.AS_ASSET_TYPES]];
                        if (at instanceof Array) {
                            at.forEach(function (typeDef) {
                                _this.assetTypes[typeDef["type"]] = new Assets.AssetTypeDefinition(typeDef);
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
                    this.schema = new Schema(JSON.parse(data));
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
                    var outAssets = [];
                    this.assets.forEach(function (asset) {
                        var outAsset = {};
                        outAsset["type"] = asset.definition.type;
                        for (var key in asset.fields) {
                            outAsset[key] = asset.fields[key].value;
                        }
                        outAssets.push(outAsset);
                    });
                    fs.writeFileSync("C:/Projects/Asses/assets.json", JSON.stringify(outAssets));
                };
                AssetService.prototype.readAssets = function (inputPath) {
                    var _this = this;
                    var assetsObj = fs.readFileSync(inputPath, 'utf8');
                    assetsObj = JSON.parse(assetsObj);
                    assetsObj.forEach(function (asset) {
                        var a = new Assets.Asset(_this.schema.assetTypes[asset.type], asset);
                        _this.assets.push(a);
                    });
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
            AssetComponent = (function () {
                function AssetComponent() {
                    console.log(this.asset);
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Assets.Asset)
                ], AssetComponent.prototype, "asset", void 0);
                AssetComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-asset',
                        templateUrl: './app/templates/assess-asset.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AssetComponent);
                return AssetComponent;
            }());
            exports_1("AssetComponent", AssetComponent);
            AssetGroupComponent = (function () {
                function AssetGroupComponent(assetService) {
                    this.assetService = assetService;
                }
                AssetGroupComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-asset-group',
                        directives: [AssetComponent, common_1.NgFor],
                        template: '<div *ngFor="#asset of assetService.assets"><assess-asset [asset]="asset"></assess-asset></div>',
                        providers: [
                            core_1.provide(AssetService, {
                                useFactory: function () {
                                    // Load project configuration stuff here
                                    var pc = new ProjectConfig();
                                    pc.assetsPath = "/assets.json";
                                    pc.schemaPath = "C:/Projects/Asses/test-schema.json";
                                    var assetService = new AssetService(pc);
                                    assetService.readAssets("C:/Projects/Asses/assets.json");
                                    return assetService;
                                }
                            })
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