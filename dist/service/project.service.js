System.register(['@angular/core', "./../utils", './../project'], function(exports_1, context_1) {
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
    var core_1, utils, project_1;
    var fs, path, ProjectService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (utils_1) {
                utils = utils_1;
            },
            function (project_1_1) {
                project_1 = project_1_1;
            }],
        execute: function() {
            fs = require('fs');
            path = require('path');
            ProjectService = (function () {
                function ProjectService(_zone) {
                    this.currentProject = null;
                    this._defaultSchema = {
                        AS_ASSETS: []
                    };
                    this._defaultStructure = {
                        assets: "AS_ASSETS"
                    };
                    this._defaultMappings = {
                        AS_ASSETS: "AS_ASSETS",
                        AS_ASSET_TYPE_TYPE: "type"
                    };
                    this._zone = _zone;
                }
                ProjectService.prototype.loadProject = function (filePath) {
                    var _this = this;
                    this._zone.run(function () {
                        try {
                            var proj = fs.readFileSync(filePath, 'utf8');
                            _this.currentProject = new project_1.Project(filePath, JSON.parse(proj));
                        }
                        catch (e) {
                            utils.logError("Project file " + filePath + " does not exist");
                        }
                    });
                };
                ProjectService.prototype.newProject = function (filePath) {
                    try {
                        var name = filePath.split(".")[0];
                        var s = name.split(path.sep);
                        name = s[s.length - 1];
                        var proj = new project_1.Project(filePath);
                        this.currentProject = proj;
                        var pathVal = this.getCurrentProjectDirectory();
                        proj.mappings = this._defaultMappings;
                        proj.assetPath = "";
                        proj.assetFilePath = name + "-assets.json";
                        proj.schema = this._defaultSchema;
                        proj.structure = this._defaultStructure;
                        proj.loaders = {};
                        fs.writeFileSync(filePath, proj.asJson());
                    }
                    catch (e) {
                        utils.logError("Error creating new project");
                    }
                };
                ProjectService.prototype.getCurrentProjectDirectory = function () {
                    var pathVal = "";
                    var pathArr = this.currentProject.filePath.split(path.sep);
                    for (var i = 0; i < pathArr.length - 1; ++i) {
                        pathVal += pathArr[i] + path.sep;
                    }
                    return pathVal;
                };
                ProjectService.prototype.writeAssetsFile = function (value) {
                    for (var key in this.currentProject.mappings) {
                        value = value.replace(new RegExp('"' + key + '"', 'g'), '"' + this.currentProject.mappings[key] + '"');
                    }
                    fs.writeFileSync(path.join(this.getCurrentProjectDirectory(), this.currentProject.assetFilePath), value);
                };
                ProjectService.prototype.readAssetsFile = function () {
                    var fileContents = fs.readFileSync(path.join(this.getCurrentProjectDirectory(), this.currentProject.assetFilePath), 'utf-8');
                    for (var key in this.currentProject.mappings) {
                        fileContents = fileContents.replace(new RegExp('"' + this.currentProject.mappings[key] + '"', 'g'), '"' + key + '"');
                    }
                    return fileContents;
                };
                ProjectService.prototype.writeProjectFile = function () {
                    var json = JSON.stringify(this.currentProject);
                    fs.writeFileSync(this.currentProject.filePath, json);
                };
                ProjectService.prototype.getProjectFolderRelative = function () {
                    var p = null;
                    if (this.currentProject != null) {
                        var filePathParts = this.currentProject.filePath.split(path.sep);
                        p = filePathParts.reduce(function (prev, curr, index, array) {
                            var ret = prev;
                            if (index < array.length - 1) {
                                ret += path.sep + curr;
                            }
                            return ret;
                        });
                        p = path.relative(__dirname, p);
                    }
                    return p;
                };
                ProjectService.prototype.resolveAbsoluteAssetFilePath = function (asset) {
                    var absAssetFolder = this.getCurrentProjectDirectory() + path.sep + this.currentProject.assetPath;
                    return absAssetFolder + path.sep + asset;
                };
                ProjectService.prototype.resolveRelativeAssetFilePath = function (asset) {
                    var absAssetFolder = this.getCurrentProjectDirectory() + path.sep + this.currentProject.assetPath;
                    console.log(absAssetFolder);
                    console.log(asset);
                    return path.relative(absAssetFolder, asset);
                };
                ProjectService = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject(core_1.NgZone)), 
                    __metadata('design:paramtypes', [core_1.NgZone])
                ], ProjectService);
                return ProjectService;
            }());
            exports_1("ProjectService", ProjectService);
        }
    }
});
//# sourceMappingURL=project.service.js.map