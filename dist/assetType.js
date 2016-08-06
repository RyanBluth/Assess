System.register(["./bootstrap", "./service/project.service", "./utils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var bootstrap_1, project_service_1, utils;
    var fs, requireFromString, DataType, AsFields, SchemaFields, Loader, AssetFieldDefinition, AssetTypeDefinition, AssetField, Asset;
    function getLoaderForDataType(AS_ASSET_FIELD_DATA_TYPE) {
        var file = null;
        switch (AS_ASSET_FIELD_DATA_TYPE) {
            case DataType.AS_STRING:
                file = "./app/loaders/default/asDefaultStringLoader.js";
                break;
            case DataType.AS_INT:
                file = "./app/loaders/default/asDefaultIntLoader.js";
                break;
            case DataType.AS_FLOAT:
                file = "./app/loaders/default/asDefaultFloatLoader.js";
                break;
            case DataType.AS_SELECT:
                file = "./app/loaders/default/asDefaultSelectLoader.js";
                break;
            case DataType.AS_BOOLEAN:
                file = "./app/loaders/default/asDefaultBooleanLoader.js";
                break;
            default:
                return null;
        }
        return fs.readFileSync(file, 'utf8');
    }
    return {
        setters:[
            function (bootstrap_1_1) {
                bootstrap_1 = bootstrap_1_1;
            },
            function (project_service_1_1) {
                project_service_1 = project_service_1_1;
            },
            function (utils_1) {
                utils = utils_1;
            }],
        execute: function() {
            fs = require('fs');
            requireFromString = require('require-from-string');
            (function (DataType) {
                DataType[DataType["AS_STRING"] = 0] = "AS_STRING";
                DataType[DataType["AS_INT"] = 1] = "AS_INT";
                DataType[DataType["AS_FLOAT"] = 2] = "AS_FLOAT";
                DataType[DataType["AS_FILE"] = 3] = "AS_FILE";
                DataType[DataType["AS_SELECT"] = 4] = "AS_SELECT";
                DataType[DataType["AS_BOOLEAN"] = 5] = "AS_BOOLEAN";
            })(DataType || (DataType = {}));
            exports_1("DataType", DataType);
            exports_1("AsFields", AsFields = {
                SCHEMA: {
                    AS_ASSETS: "AS_ASSETS",
                    AS_ASSET_TYPE_NAME: "AS_ASSET_TYPE_NAME",
                    AS_ASSET_TYPE_TYPE: "AS_ASSET_TYPE_TYPE",
                    AS_ASSET_TYPE_FIELDS: "AS_ASSET_TYPE_FIELDS",
                    AS_ASSET_FIELD_NAME: "AS_ASSET_FIELD_NAME",
                    AS_ASSET_FIELD_DATA_TYPE: "AS_ASSET_FIELD_DATA_TYPE",
                    AS_ASSET_FIELD_LOADER: "AS_ASSET_FIELD_LOADER",
                }
            });
            (function (SchemaFields) {
                SchemaFields[SchemaFields["AS_ASSETS"] = 0] = "AS_ASSETS";
            })(SchemaFields || (SchemaFields = {}));
            exports_1("SchemaFields", SchemaFields);
            Loader = (function () {
                function Loader(name, generateBody) {
                    this.name = name;
                    if (generateBody) {
                        this.body =
                            "exports.create = function create(value) {\n\treturn {\n\t\ttemplate: function() {\n\t\t\treturn '<input type=\"text\" value=\"' + value + '\"/>'\n\t\t},\n\t\tsetup: function(elem, updateValueFunc) {\n\t\t\telem.onchange = function(newVal) {\n\t\t\t\tupdateValueFunc(newVal.target.value);\n\t\t\t};\n\t\t}\n\t}\n}\n";
                    }
                }
                return Loader;
            }());
            exports_1("Loader", Loader);
            AssetFieldDefinition = (function () {
                function AssetFieldDefinition(def) {
                    var missingProps = utils.assertHasProperties(def, ['AS_ASSET_FIELD_NAME', 'AS_ASSET_FIELD_DATA_TYPE']);
                    if (missingProps.length > 0) {
                        missingProps.forEach(function (prop) {
                            utils.logError("Missing required property " + prop + " for AssetField");
                        });
                    }
                    else {
                        this.name = def.AS_ASSET_FIELD_NAME;
                        this.AS_ASSET_FIELD_DATA_TYPE = DataType[def.AS_ASSET_FIELD_DATA_TYPE];
                        if (def.hasOwnProperty("default")) {
                            this.default = def.default;
                        }
                        else {
                            switch (this.AS_ASSET_FIELD_DATA_TYPE) {
                                case DataType.AS_STRING:
                                    this.default = "";
                                    break;
                                case DataType.AS_INT:
                                    this.default = 0;
                                    break;
                                case DataType.AS_FLOAT:
                                    this.default = 0.0;
                                    break;
                                case DataType.AS_SELECT:
                                    this.default = [];
                                    break;
                                case DataType.AS_BOOLEAN:
                                    this.default = false;
                                    break;
                                default:
                                    this.default = null;
                            }
                        }
                        if (!def.hasOwnProperty("AS_ASSET_FIELD_LOADER")) {
                            this.loader = requireFromString(getLoaderForDataType(this.AS_ASSET_FIELD_DATA_TYPE));
                            if (this.loader === null) {
                                utils.logError("No loader was provided for AssetType " + this.name + " and no default " +
                                    "loader was found for data type " + def.AS_ASSET_FIELD_DATA_TYPE);
                                return;
                            }
                        }
                        else {
                            var projectService = bootstrap_1.globalAppInjector.get(project_service_1.ProjectService);
                            this.loader = requireFromString(projectService.currentProject.loaders[def.AS_ASSET_FIELD_LOADER].body);
                        }
                    }
                }
                return AssetFieldDefinition;
            }());
            exports_1("AssetFieldDefinition", AssetFieldDefinition);
            AssetTypeDefinition = (function () {
                function AssetTypeDefinition(def) {
                    var _this = this;
                    this.fields = [];
                    var missingProps = utils.assertHasProperties(def, ['AS_ASSET_TYPE_NAME', 'AS_ASSET_TYPE_TYPE', 'AS_ASSET_TYPE_FIELDS']);
                    if (missingProps.length > 0) {
                        missingProps.forEach(function (prop) {
                            utils.logError("Missing required property " + prop + " for AssetType");
                        });
                    }
                    else {
                        this.name = def.AS_ASSET_TYPE_NAME;
                        this.type = def.AS_ASSET_TYPE_TYPE;
                        def.AS_ASSET_TYPE_FIELDS.forEach(function (fieldDef) {
                            _this.fields.push(new AssetFieldDefinition(fieldDef));
                        });
                    }
                }
                return AssetTypeDefinition;
            }());
            exports_1("AssetTypeDefinition", AssetTypeDefinition);
            AssetField = (function () {
                function AssetField(def, value) {
                    this.definition = def;
                    if (value) {
                        this.value = value;
                    }
                    else {
                        this.value = def.default;
                    }
                    this._loader = def.loader;
                    this.setValue(value);
                    this.editing = true;
                }
                AssetField.prototype.toggleEditMode = function () {
                    this.editing = !this.editing;
                };
                AssetField.prototype.refresh = function () {
                    this.setValue(this.value);
                };
                AssetField.prototype.setValue = function (value) {
                    if (this.definition.AS_ASSET_FIELD_DATA_TYPE == DataType.AS_FILE) {
                        var projectService = bootstrap_1.globalAppInjector.get(project_service_1.ProjectService);
                        var absValue = projectService.resolveAbsoluteAssetFilePath(value);
                        this.create = this._loader.create(absValue);
                    }
                    else {
                        this.create = this._loader.create(this.value);
                    }
                };
                return AssetField;
            }());
            exports_1("AssetField", AssetField);
            Asset = (function () {
                function Asset(def, fieldValues) {
                    var _this = this;
                    this.fields = {};
                    this.definition = def;
                    // Instantiate the asset fields with null values so they are assigned defaults
                    def.fields.forEach(function (field) {
                        var val = null;
                        if (fieldValues && fieldValues.hasOwnProperty(field.name)) {
                            val = fieldValues[field.name];
                        }
                        _this.fields[field.name] = new AssetField(field, val);
                    });
                }
                Asset.prototype.getFieldKeys = function () {
                    return Object.keys(this.fields);
                };
                Asset.prototype.isFieldDefined = function (fieldName) {
                    this.definition.fields.forEach(function (field) {
                        if (field.name === fieldName) {
                            return true;
                        }
                    });
                    return false;
                };
                return Asset;
            }());
            exports_1("Asset", Asset);
        }
    }
});
//# sourceMappingURL=assetType.js.map