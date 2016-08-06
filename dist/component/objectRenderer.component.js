System.register(['@angular/core', '@angular/common', './popup.component', './../directive/adjustingInput.directive', './../service/globalEvent.service', './../utils', './../assetType'], function(exports_1, context_1) {
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
    var core_1, common_1, popup_component_1, adjustingInput_directive_1, globalEvent_service_1, Utils, assetType_1;
    var ObjectRendererComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (popup_component_1_1) {
                popup_component_1 = popup_component_1_1;
            },
            function (adjustingInput_directive_1_1) {
                adjustingInput_directive_1 = adjustingInput_directive_1_1;
            },
            function (globalEvent_service_1_1) {
                globalEvent_service_1 = globalEvent_service_1_1;
            },
            function (Utils_1) {
                Utils = Utils_1;
            },
            function (assetType_1_1) {
                assetType_1 = assetType_1_1;
            }],
        execute: function() {
            ObjectRendererComponent = (function () {
                function ObjectRendererComponent(_globalEventService, _zone) {
                    this.collapsed = false;
                    this._sortedFields = [];
                    this._closingBracket = false;
                    this._bracketColors = [
                        "#ff0000",
                        "#00ff00",
                        "#0000ff",
                    ];
                    this._globalEventService = _globalEventService;
                    this._zone = _zone;
                }
                ObjectRendererComponent.prototype.ngOnInit = function () {
                    this._sortedFields = Object.keys(this.object);
                };
                ObjectRendererComponent.prototype.ngAfterContentChecked = function () {
                    var keys = Object.keys(this.object);
                    var diff = keys.length - this._sortedFields.length;
                    if (diff > 0) {
                        this._sortedFields.push(keys[keys.length - 1]);
                    }
                };
                ObjectRendererComponent.prototype.objectProperties = function () {
                    return this._sortedFields;
                };
                ObjectRendererComponent.prototype.isArray = function (val) {
                    return val instanceof Array && !(val instanceof String);
                };
                ObjectRendererComponent.prototype.isObject = function (val) {
                    return (val instanceof Object) && !(val instanceof Array) && !(val instanceof String);
                };
                ObjectRendererComponent.prototype.isInteger = function (val) {
                    return !isNaN(val);
                };
                ObjectRendererComponent.prototype.toggleCollapse = function () {
                    this.collapsed = !this.collapsed;
                };
                ObjectRendererComponent.prototype.getColorForType = function (prop) {
                    return typeof this.object[prop];
                };
                ObjectRendererComponent.prototype.updateKey = function (key, event) {
                    if (event.target.value.length == 0) {
                        event.srcElement.value = key;
                        Utils.logError("Key cannot be a blank value");
                        return;
                    }
                    if (!this.object.hasOwnProperty(event.target.value)) {
                        var val = this.object[key];
                        delete this.object[key];
                        this.object[event.target.value] = val;
                        this._sortedFields[this._sortedFields.indexOf(key)] = event.target.value;
                    }
                    else {
                        Utils.logError("Can't update value. Property " + event.target.value + " already exists");
                        event.srcElement.value = key;
                    }
                };
                ObjectRendererComponent.prototype.addNewProperty = function (property) {
                    if (this.isArray(this.object[property])) {
                        this.object[property].push('');
                    }
                    else if (this.isObject(this.object[property])) {
                        var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
                        this.object[property][newKey] = "";
                    }
                    else {
                        Utils.logError("Could not add new element");
                    }
                };
                ObjectRendererComponent.prototype.addNewArray = function (property) {
                    if (this.isArray(this.object[property])) {
                        this.object[property].push(new Array());
                    }
                    else if (this.isObject(this.object[property])) {
                        var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
                        this.object[property][newKey] = new Array();
                    }
                    else {
                        Utils.logError("Could not add new element");
                    }
                };
                ObjectRendererComponent.prototype.addNewObject = function (property) {
                    if (this.isArray(this.object[property])) {
                        this.object[property].push(new Object());
                    }
                    else if (this.isObject(this.object[property])) {
                        var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
                        this.object[property][newKey] = new Object();
                    }
                    else {
                        Utils.logError("Could not add new element");
                    }
                };
                ObjectRendererComponent.prototype.deleteProperty = function (property) {
                    if (this.isArray(this.object)) {
                        this.object.splice(property, 1);
                        this._sortedFields = [];
                        for (var i = 0; i < this.object.length; ++i) {
                            this._sortedFields.push(i);
                        }
                    }
                    else if (this.isObject(this.object)) {
                        delete this.object[property];
                        this._sortedFields.splice(this._sortedFields.indexOf(property), 1);
                    }
                    else {
                        Utils.logError("Could not delete " + property);
                    }
                };
                ObjectRendererComponent.prototype.getOptionsForProperty = function (property) {
                    var _this = this;
                    var options = [];
                    if (this.isArray(this.object[property])) {
                        options.push(new popup_component_1.PopupOption("New Element", function () { _this.addNewProperty(property); }), new popup_component_1.PopupOption("New Object", function () { _this.addNewObject(property); }), new popup_component_1.PopupOption("New Array", function () { _this.addNewArray(property); }), new popup_component_1.PopupOption("Delete", function () { _this.deleteProperty(property); }));
                    }
                    else if (this.isObject(this.object[property])) {
                        options.push(new popup_component_1.PopupOption("New Property", function () { _this.addNewProperty(property); }), new popup_component_1.PopupOption("New Object", function () { _this.addNewObject(property); }), new popup_component_1.PopupOption("New Array", function () { _this.addNewArray(property); }), new popup_component_1.PopupOption("Delete", function () { _this.deleteProperty(property); }));
                    }
                    else {
                        options.push(new popup_component_1.PopupOption("Delete", function () { _this.deleteProperty(property); }));
                    }
                    if (property == assetType_1.AsFields.SCHEMA.AS_ASSETS) {
                        options.push(new popup_component_1.PopupOption("New Asset Type", function () {
                            _this.object[assetType_1.AsFields.SCHEMA.AS_ASSETS].push({
                                AS_ASSET_TYPE_NAME: "Display Name",
                                AS_ASSET_TYPE_TYPE: "Asset Type",
                                AS_ASSET_TYPE_FIELDS: []
                            });
                        }));
                    }
                    if (property == assetType_1.AsFields.SCHEMA.AS_ASSET_TYPE_FIELDS) {
                        options.push(new popup_component_1.PopupOption("New Field", function () {
                            _this.object[assetType_1.AsFields.SCHEMA.AS_ASSET_TYPE_FIELDS].push({
                                AS_ASSET_FIELD_DATA_TYPE: "AS_STRING",
                                AS_ASSET_FIELD_NAME: "Field Name"
                            });
                        }));
                    }
                    return options;
                };
                ObjectRendererComponent.prototype.getCompletionsForProperty = function (property) {
                    var _this = this;
                    var options = [];
                    if (property == assetType_1.AsFields.SCHEMA.AS_ASSET_FIELD_DATA_TYPE) {
                        options.push(new popup_component_1.PopupOption("AS_STRING", function () { _this.object[property] = "AS_STRING"; }), new popup_component_1.PopupOption("AS_BOOLEAN", function () { _this.object[property] = "AS_BOOLEAN"; }), new popup_component_1.PopupOption("AS_FLOAT", function () { _this.object[property] = "AS_FLOAT"; }), new popup_component_1.PopupOption("AS_INT", function () { _this.object[property] = "AS_INT"; }));
                    }
                    return options;
                };
                ObjectRendererComponent.prototype.getOptionsForRoot = function () {
                    var _this = this;
                    var options = [];
                    if (this.isArray(this.object)) {
                        options.push(new popup_component_1.PopupOption("New Element", function () { _this.object.push(""); }), new popup_component_1.PopupOption("New Object", function () { _this.object.push({}); }), new popup_component_1.PopupOption("New Array", function () { _this.object.push([]); }));
                    }
                    else if (this.isObject(this.object)) {
                        var newKey = "Property" + (Object.keys(this.object).length + 1).toString();
                        options.push(new popup_component_1.PopupOption("New Property", function () { _this.object[newKey] = "New Value"; }), new popup_component_1.PopupOption("New Object", function () { _this.object[newKey] = {}; }), new popup_component_1.PopupOption("New Array", function () { _this.object[newKey] = []; }));
                    }
                    return options;
                };
                ObjectRendererComponent.prototype.getBracketColor = function () {
                    if (this.bracketIndex >= this._bracketColors.length) {
                        this.bracketIndex = 0;
                    }
                    var color = this._bracketColors[this.bracketIndex];
                    if (this._closingBracket) {
                        this.bracketIndex++;
                    }
                    this._closingBracket = !this._closingBracket;
                    return color;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], ObjectRendererComponent.prototype, "object", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], ObjectRendererComponent.prototype, "bracketIndex", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ObjectRendererComponent.prototype, "isRootElement", void 0);
                ObjectRendererComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-object-renderer',
                        templateUrl: './app/templates/assess-object-renderer.html',
                        directives: [common_1.NgFor, common_1.NgIf, common_1.NgModel, ObjectRendererComponent, popup_component_1.PopupComponent, adjustingInput_directive_1.AdjustingInputDirective]
                    }),
                    __param(0, core_1.Inject(globalEvent_service_1.GlobalEventService)), 
                    __metadata('design:paramtypes', [globalEvent_service_1.GlobalEventService, core_1.NgZone])
                ], ObjectRendererComponent);
                return ObjectRendererComponent;
            }());
            exports_1("ObjectRendererComponent", ObjectRendererComponent);
        }
    }
});
//# sourceMappingURL=objectRenderer.component.js.map