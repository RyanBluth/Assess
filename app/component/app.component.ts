declare function require(moduleName: string): any;
declare var CodeMirror: any; 
declare var __dirname: any;

import {globalAppInjector} from "./../bootstrap"

import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from '@angular/core';

import {NgFor, NgIf, NgModel, NgClass} from '@angular/common';

import {AssetWriteFormat} from './../project'

import {ProjectService} from './../service/project.service'
import {AssetService} from './../service/asset.service'
import {GlobalEventService} from './../service/globalEvent.service'

import {AssetGroupComponent} from './assetGroup.component'
import {TabNavComponent} from './tabNav.component'
import {SchemaComponent} from './schema.component'
import {StructureComponent} from './structure.component'
import {ConsoleComponent} from './console.component'
import {AdjustingInputDirective} from './../directive/adjustingInput.directive'
import {LoadersComponent} from './loaders.component'    	

// Node includes
const fs = require('fs'); 
const path = require('path');

// Electron includes
const electron = require('electron');
const remote = require('remote');
const { BrowserWindow } = require('electron').remote;
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');
const { dialog } = require('electron').remote;

// Declare jquery - It's included in index.html
declare var jQuery: any;

// Get the window we created in main.js
var mainWindow = BrowserWindow.fromId(1);

var currentProjectPath = null; // Current Project File Path

// Setup menu
var template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Project',
				accelerator: 'CmdOrCtrl+N',
				click: function() {
					dialog.showSaveDialog(
						{ properties: ['saveFile'], filters: [{ name: 'Assess Project', extensions: ['assess_project'] }] },
						(file) => {
							if (file != undefined) {
								var projService: ProjectService = globalAppInjector.get(ProjectService);
								projService.newProject(file.toString());
								var assetService: AssetService = globalAppInjector.get(AssetService);
								assetService.loadProject(projService.currentProject);
								assetService.writeAssets(AssetWriteFormat.JSON, projService.currentProject.assetPath);
							}
						}
					);
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Open Project',
				accelerator: 'CmdOrCtrl+o',
				click: function() {
					dialog.showOpenDialog(
						{ properties: ['openFile'], filters: [{ name: 'Assess Project', extensions: ['assess_project'] }] },
						(file) => {
							if (file != undefined) {
								var projService = globalAppInjector.get(ProjectService);
								projService.loadProject(file.toString());
								globalAppInjector.get(AssetService).loadProject(projService.currentProject);
							}
						}
					);
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Reload',
				accelerator: 'CmdOrCtrl+R',
				click: function() { mainWindow.reload() }
			}
		]
	}
];

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

@Component({
    selector: 'assess-app',
    templateUrl: './app/templates/assess-app.html',
    directives: [TabNavComponent, 
    	SchemaComponent, StructureComponent, 
    	ConsoleComponent, AdjustingInputDirective, LoadersComponent]
})
export class AppComponent{

	private _assetService: AssetService;
	private _globalEventService: GlobalEventService;
	private _elem: ElementRef;
	private _projectService: ProjectService;
	private _zone:NgZone;

	public MODES = {
		ASSETS 	  : 0,  
		SCHEMA 	  : 1,  
		STRUCTURE : 2, 
		LOADERS   : 3 
	}

	public currentMode = this.MODES.ASSETS;

	public mainNavTabs = [
		{
			label: "Assets",
			click: () => { 
				this.currentMode = this.MODES.ASSETS;
			}
		},
		{
			label: "Schema",
			click: () => { 
				this.currentMode = this.MODES.SCHEMA;
			},
		},
		{
			label: "Structure",
			click: () => {
				this.currentMode = this.MODES.STRUCTURE;
			},
		},
		{
			label: "Loaders",
			click: () => {
				this.currentMode = this.MODES.LOADERS;
			},
		}
	];

	constructor(
		elem: ElementRef,
		@Inject(AssetService) assetService: AssetService, 
		@Inject(GlobalEventService) globalEventService: GlobalEventService,
		@Inject(ProjectService) projectService: ProjectService,
		@Inject(NgZone)_zone:NgZone)
	{
		this._elem = elem.nativeElement;
		this._assetService = assetService;
		this._globalEventService = globalEventService;
		this._globalEventService.hookupAppElement(this);
		this._projectService = projectService;
		this._zone = _zone;
	}

	public getElement(): any{
		return this._elem;
	}

	public initialize(){
		this._assetService.loadLastProject();
	}

}


