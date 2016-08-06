System.register(["./../bootstrap", '@angular/core', './../project', './../service/project.service', './../service/asset.service', './../service/globalEvent.service', './assetGroup.component', './tabNav.component', './schema.component', './structure.component', './console.component', './../directive/adjustingInput.directive', './loaders.component'], function(exports_1, context_1) {
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
    var bootstrap_1, core_1, project_1, project_service_1, asset_service_1, globalEvent_service_1, assetGroup_component_1, tabNav_component_1, schema_component_1, structure_component_1, console_component_1, adjustingInput_directive_1, loaders_component_1;
    var fs, path, electron, remote, BrowserWindow, Menu, MenuItem, dialog, mainWindow, currentProjectPath, template, menu, AppComponent;
    return {
        setters:[
            function (bootstrap_1_1) {
                bootstrap_1 = bootstrap_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (project_1_1) {
                project_1 = project_1_1;
            },
            function (project_service_1_1) {
                project_service_1 = project_service_1_1;
            },
            function (asset_service_1_1) {
                asset_service_1 = asset_service_1_1;
            },
            function (globalEvent_service_1_1) {
                globalEvent_service_1 = globalEvent_service_1_1;
            },
            function (assetGroup_component_1_1) {
                assetGroup_component_1 = assetGroup_component_1_1;
            },
            function (tabNav_component_1_1) {
                tabNav_component_1 = tabNav_component_1_1;
            },
            function (schema_component_1_1) {
                schema_component_1 = schema_component_1_1;
            },
            function (structure_component_1_1) {
                structure_component_1 = structure_component_1_1;
            },
            function (console_component_1_1) {
                console_component_1 = console_component_1_1;
            },
            function (adjustingInput_directive_1_1) {
                adjustingInput_directive_1 = adjustingInput_directive_1_1;
            },
            function (loaders_component_1_1) {
                loaders_component_1 = loaders_component_1_1;
            }],
        execute: function() {
            // Node includes
            fs = require('fs');
            path = require('path');
            // Electron includes
            electron = require('electron');
            remote = require('remote');
            BrowserWindow = require('electron').remote.BrowserWindow;
            Menu = remote.require('menu');
            MenuItem = remote.require('menu-item');
            dialog = require('electron').remote.dialog;
            // Get the window we created in main.js
            mainWindow = BrowserWindow.fromId(1);
            currentProjectPath = null; // Current Project File Path
            // Setup menu
            template = [
                {
                    label: 'File',
                    submenu: [
                        {
                            label: 'New Project',
                            accelerator: 'CmdOrCtrl+N',
                            click: function () {
                                dialog.showSaveDialog({ properties: ['saveFile'], filters: [{ name: 'Assess Project', extensions: ['assess_project'] }] }, function (file) {
                                    if (file != undefined) {
                                        var projService = bootstrap_1.globalAppInjector.get(project_service_1.ProjectService);
                                        projService.newProject(file.toString());
                                        var assetService = bootstrap_1.globalAppInjector.get(asset_service_1.AssetService);
                                        assetService.loadProject(projService.currentProject);
                                        assetService.writeAssets(project_1.AssetWriteFormat.JSON, projService.currentProject.assetPath);
                                    }
                                });
                            }
                        },
                        {
                            type: 'separator'
                        },
                        {
                            label: 'Open Project',
                            accelerator: 'CmdOrCtrl+o',
                            click: function () {
                                dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Assess Project', extensions: ['assess_project'] }] }, function (file) {
                                    if (file != undefined) {
                                        var projService = bootstrap_1.globalAppInjector.get(project_service_1.ProjectService);
                                        projService.loadProject(file.toString());
                                        bootstrap_1.globalAppInjector.get(asset_service_1.AssetService).loadProject(projService.currentProject);
                                    }
                                });
                            }
                        },
                        {
                            type: 'separator'
                        },
                        {
                            label: 'Reload',
                            accelerator: 'CmdOrCtrl+R',
                            click: function () { mainWindow.reload(); }
                        }
                    ]
                }
            ];
            menu = Menu.buildFromTemplate(template);
            Menu.setApplicationMenu(menu);
            AppComponent = (function () {
                function AppComponent(elem, assetService, globalEventService, projectService) {
                    var _this = this;
                    this.MODES = {
                        ASSETS: 0,
                        SCHEMA: 1,
                        STRUCTURE: 2,
                        LOADERS: 3
                    };
                    this.currentMode = this.MODES.ASSETS;
                    this.mainNavTabs = [
                        {
                            label: "Assets",
                            click: function () {
                                _this.currentMode = _this.MODES.ASSETS;
                            }
                        },
                        {
                            label: "Schema",
                            click: function () {
                                _this.currentMode = _this.MODES.SCHEMA;
                            },
                        },
                        {
                            label: "Structure",
                            click: function () {
                                _this.currentMode = _this.MODES.STRUCTURE;
                            },
                        },
                        {
                            label: "Loaders",
                            click: function () {
                                _this.currentMode = _this.MODES.LOADERS;
                            },
                        }
                    ];
                    this._elem = elem.nativeElement;
                    this._assetService = assetService;
                    this._globalEventService = globalEventService;
                    this._globalEventService.hookupAppElement(this);
                    this._projectService = projectService;
                }
                AppComponent.prototype.getElement = function () {
                    return this._elem;
                };
                AppComponent.prototype.initialize = function () {
                    this._assetService.loadLastProject();
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-app',
                        templateUrl: './app/templates/assess-app.html',
                        directives: [assetGroup_component_1.AssetGroupComponent, tabNav_component_1.TabNavComponent,
                            schema_component_1.SchemaComponent, structure_component_1.StructureComponent,
                            console_component_1.ConsoleComponent, adjustingInput_directive_1.AdjustingInputDirective, loaders_component_1.LoadersComponent]
                    }),
                    __param(1, core_1.Inject(asset_service_1.AssetService)),
                    __param(2, core_1.Inject(globalEvent_service_1.GlobalEventService)),
                    __param(3, core_1.Inject(project_service_1.ProjectService)), 
                    __metadata('design:paramtypes', [core_1.ElementRef, asset_service_1.AssetService, globalEvent_service_1.GlobalEventService, project_service_1.ProjectService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map