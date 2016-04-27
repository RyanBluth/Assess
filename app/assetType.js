System.register(["./utils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils;
    var DataType, SchemaFields, AssetFieldDefinition, AssetTypeDefinition, AssetField, Asset;
    function getLoaderForDataType(dataType) {
        switch (dataType) {
            case DataType.AS_STRING:
                return "default/asDefaultStringLoader.js";
            case DataType.AS_INT:
                return "default/asDefaultIntLoader.js";
            case DataType.AS_FLOAT:
                return "default/asDefaultFloatLoader.js";
            case DataType.AS_SELECT:
                return "default/asDefaultSelectLoader.js";
            case DataType.AS_BOOLEAN:
                return "default/asDefaultBooleanLoader.js";
            default:
                return null;
        }
    }
    return {
        setters:[
            function (utils_1) {
                utils = utils_1;
            }],
        execute: function() {
            (function (DataType) {
                DataType[DataType["AS_STRING"] = 0] = "AS_STRING";
                DataType[DataType["AS_INT"] = 1] = "AS_INT";
                DataType[DataType["AS_FLOAT"] = 2] = "AS_FLOAT";
                DataType[DataType["AS_FILE"] = 3] = "AS_FILE";
                DataType[DataType["AS_SELECT"] = 4] = "AS_SELECT";
                DataType[DataType["AS_BOOLEAN"] = 5] = "AS_BOOLEAN";
            })(DataType || (DataType = {}));
            exports_1("DataType", DataType);
            (function (SchemaFields) {
                SchemaFields[SchemaFields["AS_ASSET_TYPES"] = 0] = "AS_ASSET_TYPES";
            })(SchemaFields || (SchemaFields = {}));
            exports_1("SchemaFields", SchemaFields);
            AssetFieldDefinition = (function () {
                function AssetFieldDefinition(def) {
                    var missingProps = utils.assertHasProperties(def, ['name', 'dataType']);
                    if (missingProps.length > 0) {
                        missingProps.forEach(function (prop) {
                            utils.logError("Missing required property " + prop + " for AssetField");
                        });
                    }
                    else {
                        this.name = def.name;
                        this.dataType = DataType[def.dataType];
                        if (def.hasOwnProperty("default")) {
                            this.default = def.default;
                        }
                        else {
                            switch (this.dataType) {
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
                        if (!def.hasOwnProperty("loader")) {
                            this.loader = getLoaderForDataType(this.dataType);
                            if (this.loader === null) {
                                utils.logError("No loader was provided for AssetType " + this.name + " and no default " +
                                    "loader was found for data type " + def.dataType);
                                return;
                            }
                        }
                        else {
                            this.loader = def.loader;
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
                    var missingProps = utils.assertHasProperties(def, ['name', 'type', 'fields']);
                    if (missingProps.length > 0) {
                        missingProps.forEach(function (prop) {
                            utils.logError("Missing required property " + prop + " for AssetType");
                        });
                    }
                    else {
                        this.name = def.name;
                        this.type = def.type;
                        def.fields.forEach(function (fieldDef) {
                            _this.fields.push(new AssetFieldDefinition(fieldDef));
                        });
                    }
                }
                return AssetTypeDefinition;
            }());
            exports_1("AssetTypeDefinition", AssetTypeDefinition);
            AssetField = (function () {
                function AssetField(def, value) {
                    var funcs = require("./app/loaders/" + def.loader);
                    this.definition = def;
                    if (value) {
                        this.value = value;
                    }
                    else {
                        this.value = def.default;
                    }
                    this.loadedValue = funcs.load(this.value);
                    this.rendered = funcs.render(this.loadedValue);
                    this.script = funcs.script;
                }
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
                        console.log(fieldValues);
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