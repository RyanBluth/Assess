System.register(['./utils', './assetType'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils, Assets;
    var Schema;
    return {
        setters:[
            function (utils_1) {
                utils = utils_1;
            },
            function (Assets_1) {
                Assets = Assets_1;
            }],
        execute: function() {
            Schema = (function () {
                function Schema(schemaAsObj, structureStr) {
                    var _this = this;
                    this.assetTypes = {};
                    this.assetTypeNames = [];
                    this.properties = [];
                    this.groups = {};
                    this.structureStr = structureStr;
                    this.structureObject = JSON.parse(structureStr);
                    this.rawObject = schemaAsObj;
                    this.properties = Object.keys(schemaAsObj);
                    var _loop_1 = function(key) {
                        var at = schemaAsObj[key];
                        this_1.groups[key] = {
                            assetTypes: {},
                            assetTypeNames: []
                        };
                        if (at instanceof Array) {
                            at.forEach(function (typeDef) {
                                _this.groups[key].assetTypes[typeDef["AS_ASSET_TYPE_TYPE"]] = new Assets.AssetTypeDefinition(typeDef);
                                _this.groups[key].assetTypeNames.push(typeDef["AS_ASSET_TYPE_TYPE"]);
                                //this.assetTypes[typeDef["AS_ASSET_TYPE_TYPE"]] = new Assets.AssetTypeDefinition(typeDef);
                                //this.assetTypeNames.push(typeDef["AS_ASSET_TYPE_TYPE"]);
                            });
                        }
                        else {
                            utils.logError("ASSET_TYPES must be an array");
                        }
                    };
                    var this_1 = this;
                    for (var key in schemaAsObj) {
                        _loop_1(key);
                    }
                    console.log(this.groups);
                }
                return Schema;
            }());
            exports_1("Schema", Schema);
        }
    }
});
//# sourceMappingURL=schema.js.map