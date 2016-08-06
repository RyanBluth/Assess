System.register(['@angular/core', '@angular/common', './codeEditor.component', './../service/project.service', './../assetType'], function(exports_1, context_1) {
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
    var core_1, common_1, codeEditor_component_1, project_service_1, Assets;
    var LoadersComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (codeEditor_component_1_1) {
                codeEditor_component_1 = codeEditor_component_1_1;
            },
            function (project_service_1_1) {
                project_service_1 = project_service_1_1;
            },
            function (Assets_1) {
                Assets = Assets_1;
            }],
        execute: function() {
            LoadersComponent = (function () {
                function LoadersComponent(_projectService) {
                    this.loaders = {};
                    this._sortedLoaders = [];
                    this._projectService = _projectService;
                }
                LoadersComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    Object.keys(this.loaders).forEach(function (loader) {
                        _this._sortedLoaders.push(loader);
                    });
                };
                LoadersComponent.prototype.updateLoaderName = function (originalKey, event) {
                    var tempBody = this.loaders[originalKey];
                    delete this.loaders[originalKey];
                    this._sortedLoaders[this._sortedLoaders.indexOf(originalKey)] = event.target.value;
                    this.loaders[event.target.value] = tempBody;
                };
                LoadersComponent.prototype.newLoader = function () {
                    var key = 'Loader' + Object.keys(this.loaders).length;
                    this.loaders[key] = (new Assets.Loader(key, true));
                    this._sortedLoaders.push(key);
                };
                LoadersComponent.prototype.openLoader = function (name) {
                    this.editor.setValue(this.loaders[name].body);
                    this._currentLoader = name;
                };
                LoadersComponent.prototype.updateLoader = function (value) {
                    this.loaders[this._currentLoader].body = value;
                };
                LoadersComponent.prototype.getLoaderNames = function () {
                    return Object.keys(this.loaders);
                };
                LoadersComponent.prototype.saveLoader = function () {
                    this._projectService.writeProjectFile();
                };
                LoadersComponent.prototype.rename = function () {
                    this._renaming = true;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], LoadersComponent.prototype, "loaders", void 0);
                __decorate([
                    core_1.ViewChild(codeEditor_component_1.CodeEditorComponent), 
                    __metadata('design:type', codeEditor_component_1.CodeEditorComponent)
                ], LoadersComponent.prototype, "editor", void 0);
                LoadersComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-loaders',
                        templateUrl: './app/templates/assess-loaders.html',
                        directives: [common_1.NgFor, common_1.NgIf, codeEditor_component_1.CodeEditorComponent, common_1.NgClass]
                    }),
                    __param(0, core_1.Inject(project_service_1.ProjectService)), 
                    __metadata('design:paramtypes', [project_service_1.ProjectService])
                ], LoadersComponent);
                return LoadersComponent;
            }());
            exports_1("LoadersComponent", LoadersComponent);
        }
    }
});
//# sourceMappingURL=loaders.component.js.map