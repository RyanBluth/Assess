System.register(['@angular/core', './../assetType', "./../utils", './project.service', './../project', './../schema'], function(exports_1, context_1) {
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
    var core_1, Assets, utils, project_service_1, project_1, schema_1;
    var fs, path, AssetService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Assets_1) {
                Assets = Assets_1;
            },
            function (utils_1) {
                utils = utils_1;
            },
            function (project_service_1_1) {
                project_service_1 = project_service_1_1;
            },
            function (project_1_1) {
                project_1 = project_1_1;
            },
            function (schema_1_1) {
                schema_1 = schema_1_1;
            }],
        execute: function() {
            // Node includes
            fs = require('fs');
            path = require('path');
            /**
            * The assest service is setup in bootstrap.ts using the global app injector
            * This gives us access to NgZone which we need in order to update things properly
            **/
            AssetService = (function () {
                function AssetService(_zone, _projectService) {
                    this.init();
                    this._zone = _zone;
                    this._projectService = _projectService;
                }
                AssetService.prototype.init = function () {
                    this.assetGroups = {};
                    this.assetTypeDefinitions = null;
                    this.schema = null;
                    this.assetsAsObj = null;
                };
                AssetService.prototype.loadLastProject = function () {
                    var lastProject = window.localStorage.getItem('lastProject');
                    if (lastProject != null && lastProject != undefined) {
                        try {
                            fs.accessSync(lastProject); // Check for file access
                            this._projectService.loadProject(lastProject);
                            this.loadProject(this._projectService.currentProject);
                        }
                        catch (ignored) { }
                    }
                };
                AssetService.prototype.loadProject = function (config) {
                    var _this = this;
                    // Run inside the injected NgZone so angular knows to do an update
                    this._zone.run(function () {
                        _this.init();
                        _this.schema = new schema_1.Schema(config.schema, JSON.stringify(config.structure, null, "\t"));
                        _this.readAssets(config.assetFilePath);
                        utils.logInfo("Opened project " + config.filePath);
                    });
                    window.localStorage.setItem("lastProject", config.filePath);
                };
                /**
                 * @brief Adds a new asset to the assets array
                 * @details Constructs the asset based on the type and populates
                 *  its fields with appropreiate default values
                 *
                 * @param type The type of the asset - specified in the schema
                 */
                AssetService.prototype.addAsset = function (type, group) {
                    var _this = this;
                    // Need to make sure there is a loaded type definition for the specified type
                    if (!this.schema.groups[group].assetTypes.hasOwnProperty(type)) {
                        utils.logError("Error occured during call to addAsset - type \"" + type + "\" is not specified in the loaded schema");
                        return;
                    }
                    // Run inside the injected NgZone so angular knows to do an update
                    this._zone.run(function () {
                        // Creeate a new asset object - passing in the type definition from the schema
                        _this.assetGroups[group].push(new Assets.Asset(_this.schema.groups[group].assetTypes[type]));
                    });
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
                    this._projectService.writeAssetsFile(outStructureStr);
                };
                AssetService.prototype.readAssets = function (inputPath) {
                    var _this = this;
                    var assetsStr = null;
                    try {
                        assetsStr = this._projectService.readAssetsFile();
                    }
                    catch (e) {
                        // If the asset file doesn't exist then write it and read it again
                        this.writeAssets(project_1.AssetWriteFormat.JSON);
                        assetsStr = this._projectService.readAssetsFile();
                    }
                    var strucToAssetMap = {};
                    var strucObj = JSON.parse(this.schema.structureStr);
                    var assetsObj = JSON.parse(assetsStr);
                    this.schema.properties.forEach(function (p) {
                        strucToAssetMap[p] = _this.findValueInObject(strucObj, p).reverse();
                        console.log(strucToAssetMap);
                        var c = null;
                        console.log(p);
                        console.log(c);
                        strucToAssetMap[p].forEach(function (p) {
                            c = assetsObj[p];
                        });
                        if (c != null) {
                            var tempAssets_1 = [];
                            c.forEach(function (asset) {
                                console.log(_this.schema.groups[p]);
                                console.log(asset.AS_ASSET_TYPE_TYPE);
                                var a = new Assets.Asset(_this.schema.groups[p].assetTypes[asset.AS_ASSET_TYPE_TYPE], asset);
                                tempAssets_1.push(a);
                            });
                            // Run inside angular
                            _this._zone.run(function () {
                                _this.assetGroups[p] = tempAssets_1;
                            });
                        }
                    });
                };
                AssetService.prototype.assetsForTypeFromGroup = function (type, group) {
                    var ret = [];
                    for (var idx in group) {
                        if (group[idx].definition.type === type) {
                            ret.push(group[idx]);
                        }
                    }
                    return ret;
                };
                AssetService.prototype.retriveValueForSchemaProperty = function (property) {
                    var outAssets = [];
                    this.assetGroups[property].forEach(function (asset) {
                        var outAsset = {};
                        outAsset["AS_ASSET_TYPE_TYPE"] = asset.definition.type;
                        for (var key in asset.fields) {
                            outAsset[key] = asset.fields[key].value;
                        }
                        outAssets.push(outAsset);
                    });
                    return JSON.stringify(outAssets, null, "\t");
                };
                AssetService.prototype.findValueInObject = function (obj, property, curPath) {
                    if (curPath === void 0) { curPath = []; }
                    for (var x in obj) {
                        ;
                        var val = obj[x];
                        if (val == property) {
                            curPath.push(x);
                            return curPath;
                        }
                        else if (val != null && typeof val == 'object') {
                            var v = this.findValueInObject(val, property, curPath);
                            if (v != null) {
                                curPath.push(x);
                                return curPath;
                            }
                        }
                    }
                    return null;
                };
                AssetService.prototype.writeProjectFile = function () {
                    this._projectService.writeProjectFile();
                    utils.logInfo("Saved project file " + this._projectService.currentProject.filePath);
                };
                AssetService.prototype.getAssetGroupNames = function () {
                    return Object.keys(this.assetGroups);
                };
                AssetService = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject(core_1.NgZone)),
                    __param(1, core_1.Inject(project_service_1.ProjectService)), 
                    __metadata('design:paramtypes', [core_1.NgZone, project_service_1.ProjectService])
                ], AssetService);
                return AssetService;
            }());
            exports_1("AssetService", AssetService);
        }
    }
});
//# sourceMappingURL=Asset.service.js.map