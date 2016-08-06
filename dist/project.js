System.register(['./utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utils;
    var Project, AssetWriteFormat;
    return {
        setters:[
            function (Utils_1) {
                Utils = Utils_1;
            }],
        execute: function() {
            Project = (function () {
                function Project(filePath, rawObj) {
                    this.filePath = null;
                    this.assetPath = null;
                    this.assetFilePath = null;
                    this.schema = {};
                    this.structure = {};
                    this.mappings = {};
                    this.loaders = {};
                    if (filePath == null || filePath == undefined) {
                        Utils.logError("File path cannot be null");
                        return;
                    }
                    this.filePath = filePath;
                    if (rawObj) {
                        for (var prop in rawObj) {
                            if (this.hasOwnProperty(prop)) {
                                this[prop] = rawObj[prop];
                            }
                            else {
                                Utils.logError("Invalid property " + prop + " in project file");
                                return;
                            }
                        }
                    }
                }
                Project.prototype.asJson = function () {
                    return JSON.stringify({
                        assetPath: this.assetPath,
                        assetFilePath: this.assetFilePath,
                        schema: this.schema,
                        structure: this.structure,
                        mappings: this.mappings,
                        loaders: this.loaders,
                    }, null, "\t");
                };
                return Project;
            }());
            exports_1("Project", Project);
            (function (AssetWriteFormat) {
                AssetWriteFormat[AssetWriteFormat["JSON"] = 0] = "JSON";
            })(AssetWriteFormat || (AssetWriteFormat = {}));
            exports_1("AssetWriteFormat", AssetWriteFormat);
        }
    }
});
//# sourceMappingURL=project.js.map