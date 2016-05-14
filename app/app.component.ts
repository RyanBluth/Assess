declare function require(moduleName: string): any;

import {globalAppInjector} from "./bootstrap"

import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, 
	ApplicationRef, Provider, Inject, Input, Output, 
	Optional, Injectable, AfterViewChecked} from 'angular2/core';

import {NgFor, NgIf, NgModel} from 'angular2/common';
import * as Assets from './assetType';
import * as utils from "./utils";
import {ProjectService, Project} from './project'

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

const AS_SchemaTypes: string[] = [
	"AS_ASSETS"
];

export enum AssetWriteFormat {
	JSON
}

// Setup menu
var template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Project',
				accelerator: 'Command+N',
				click: function() {
					dialog.showSaveDialog(
						{ properties: ['saveFile'], filters: [{ name: 'Assess Project', extensions: ['assess_project'] }] },
						(file) => {
							if (file != undefined) {
								var projService: ProjectService = globalAppInjector.get(ProjectService);
								projService.newProject(file.toString());
								var assetService: AssetService = globalAppInjector.get(AssetService);
								assetService.loadProject(projService.currentProject);
								assetService.writeAssets(AssetWriteFormat.JSON, projService.currentProject.assetFilePath);
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
				accelerator: 'Command+o',
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
				accelerator: 'Command+R',
				click: function() { mainWindow.reload() }
			}
		]
	}
];

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

export class Schema{
	
	public assetTypes: {} = {};
	public assetTypeNames: string[] = [];
	public properties: string[] = [];
	public structureStr: string;
	public rawObject: {};

	constructor(schemaAsObj: any, structureStr: string){
		this.structureStr = structureStr;
		this.rawObject = schemaAsObj;
		this.properties = Object.keys(schemaAsObj);
		if (schemaAsObj.hasOwnProperty(Assets.SchemaFields[Assets.SchemaFields.AS_ASSETS])){
			let at = schemaAsObj[Assets.SchemaFields[Assets.SchemaFields.AS_ASSETS]]; 
			if(at instanceof Array){
				at.forEach((typeDef) => {
					this.assetTypes[typeDef["type"]] = new Assets.AssetTypeDefinition(typeDef);
					this.assetTypeNames.push(typeDef["type"]);
				});
			}else{
				utils.logError("ASSET_TYPES must be an array");
			}
		}
	}
}

/**
* The assest service is setup in bootstrap.ts using the global app injector
* This gives us access to NgZone which we need in order to update things properly 
**/
@Injectable()
export class AssetService{
	public assets: Assets.Asset[] = [];
	public assetTypeDefinitions: any = null;

	public schema: Schema = null;
	public assetsAsObj: any = null; // Asset file loaded as object

	private _zone: NgZone;// Angular zone
	private _projectService: ProjectService;

	constructor( 
		@Inject(NgZone) _zone: NgZone, 
		@Inject(ProjectService) _projectService: ProjectService) 
	{
		this._zone = _zone;
		this._projectService = _projectService;
		var lastProject = window.localStorage.getItem('lastProject');
		if (lastProject != null && lastProject != undefined) {
			try{
				fs.accessSync(lastProject); // Check for file access
				this._projectService.loadProject(lastProject);
				this.loadProject(this._projectService.currentProject);
			}catch(ignored){/*Fail silently*/}
		}
	}

	public loadProject(config: Project){
		// Run inside the injected NgZone so angular knows to do an update
		this._zone.run(() => {
			this.schema = new Schema(config.schema, JSON.stringify(config.structure, null, "\t"));
			this.readAssets(config.assetFilePath);
		});

		window.localStorage.setItem("lastProject", config.filePath);
	}

	/**
	 * @brief Adds a new asset to the assets array 
	 * @details Constructs the asset based on the type and populates
	 *  its fields with appropreiate default values
	 * 
	 * @param type The type of the asset - specified in the schema
	 */
	public addAsset(type: string): void {
		// Need to make sure there is a loaded type definition for the specified type
		if(!this.schema.assetTypes.hasOwnProperty(type)){
			utils.logError("Error occured during call to addAsset - type \"" + type + "\" is not specified in the loaded schema");
			return;
		}
		// Run inside the injected NgZone so angular knows to do an update
		this._zone.run(() => {
			// Creeate a new asset object - passing in the type definition from the schema
			this.assets.push(new Assets.Asset(this.schema.assetTypes[type]));
		});
	}	

	/**
	 * Write the current assets to a file using the specified format
	 * If the outputPasth isn't specied try and load it from the project.json file
	 */
	public writeAssets(format:AssetWriteFormat, outputPath?: string) : void {
		
		var outStructureStr = this.schema.structureStr;
 		// insert AS properties from schema into output assets
		this.schema.properties.forEach(prop => {
			outStructureStr = outStructureStr.replace(new RegExp('"' + prop +'"', 'i'), this.retriveValueForSchemaProperty(prop));
		});
		this._projectService.writeAssetsFile(outStructureStr);
	}

	public readAssets(inputPath?: string) : void{
		var assetsStr = null;
		
		try{
			assetsStr = this._projectService.readAssetsFile();
		}catch(e){
			// If the asset file doesn't exist then write it and read it again
			this.writeAssets(AssetWriteFormat.JSON);
			assetsStr = this._projectService.readAssetsFile();
		}
		let strucToAssetMap = {};
		let strucObj = JSON.parse(this.schema.structureStr);
		this.schema.properties.forEach(p => {
			strucToAssetMap[p] = this.findValueInObject(strucObj, p).reverse();
		});

		// @TODO Load custom properties
		let assetsObj = JSON.parse(assetsStr);
		var c = null;
		strucToAssetMap["AS_ASSETS"].forEach(p => {
			if(c == null){
				c = assetsObj[p];
			}else{
				c = c[p];
			}
		});

		if (c != null) {
			var tempAssets = [];
			c.forEach((asset) => {
				let a: Assets.Asset = new Assets.Asset(this.schema.assetTypes[asset.type], asset);
				tempAssets.push(a);
			});
			// Run inside angular
			this._zone.run(() => {
				this.assets = tempAssets;
			});
		}
	}

	public assetsForType(type:string): Assets.Asset[]{
		var ret: Assets.Asset[] = [];
		for(let idx in this.assets){
			if(this.assets[idx].definition.type === type){
				ret.push(this.assets[idx]);
			}
		}
		return ret;
	}

	public retriveValueForSchemaProperty(property: string) : string{
		if(AS_SchemaTypes.indexOf(property) != -1){
			switch (property) {
				case "AS_ASSETS":
					let outAssets = [];
					this.assets.forEach((asset) => {
						let outAsset = {};
						outAsset["type"] = asset.definition.type;

						for (let key in asset.fields) {
							outAsset[key] = asset.fields[key].value;
						}
						outAssets.push(outAsset);
					});
					return JSON.stringify(outAssets, null, "\t");
			}
		}else{
			// @TODO Retrive custom properties
			return '"DDDDDD"';
		}
		return "";
	}

	public findValueInObject(obj: any, property: string, curPath: any[] = []): any[] {
		for(let x in obj){;
			let val = obj[x];
			if (val == property){
				curPath.push(x);
				return curPath;
			}
			else if(val != null && typeof val == 'object'){
				let v = this.findValueInObject(val, property, curPath);
				if(v != null){
					curPath.push(x);	
					return curPath;
				}
			}
		}
		return null;
	}
}

@Component({
	selector: '[asses-asset-field]',
	template: '<div class="asset-field" [innerHTML]="field.create.template()"></div>',
})
export class AssetFieldComponent implements AfterViewChecked {
	@Input() field: Assets.AssetField;

	private _elem: any;
	private _assetService: AssetService;
	private _zone: NgZone;

	constructor(_zone:NgZone, _elem: ElementRef, @Inject(AssetService) _assetService: AssetService) {
		this._elem = _elem.nativeElement;
		this._assetService = _assetService;
		this._zone = _zone;
	}

	public ngAfterViewChecked() {
		this.field.create.setup(this._elem, (value) => {this.updateValue(value)});
	}

	public updateValue(value){
		this._zone.run(() => {
				this.field.value = value;
				this.field.refresh();
			}
		);
		this._assetService.writeAssets(AssetWriteFormat.JSON);
	}
}


@Component({
	selector: '[assess-asset]',
	directives: [AssetFieldComponent],
	templateUrl: './app/templates/assess-asset.html'
})
export class AssetComponent{
	
	@Input() asset : Assets.Asset;

	constructor() {}
}


@Component({
	selector: '[assess-asset-header]',
	templateUrl: './app/templates/assess-asset-header.html'
})
export class AssetHeaderComponent {

	@Input() assetType: Assets.AssetTypeDefinition;

	constructor() { }
}

@Component({
    selector: 'assess-asset-group',
    directives: [AssetComponent, AssetHeaderComponent, NgFor, NgIf],
    templateUrl: './app/templates/assess-asset-group.html'
})
export class AssetGroupComponent {

	public assetService: AssetService;

	constructor( @Inject(AssetService) assetService: AssetService) {
		this.assetService = assetService; 
	}

	public ngAfterViewChecked() {
		jQuery("table").colResizable({ liveDrag: true });
	}
}


@Component({
	selector: 'assess-object-renderer',
	templateUrl: './app/templates/assess-object-renderer.html',
	directives: [NgFor, NgIf, NgModel, ObjectRendererComponent]
})
export class ObjectRendererComponent {

	@Input() object: {}[];

	public collapsed = false;

	constructor() { 
	}

	public objectProperties(): string[]{
		return Object.keys(this.object);
	}

	public isArray(val): boolean {
		return val instanceof Array && !(val instanceof String);
	}

	public isObject(val): boolean {
		return (val instanceof Object) && !(val instanceof Array) && !(val instanceof String);
	}

	public isInteger(val): boolean{
		return !isNaN(val);
	}

	public toggleCollapse(): void{
		this.collapsed = !this.collapsed;
	}

	public addNewProperty() : void{
		if(this.isArray(this.object)) {
			(<Array<any>>this.object).push('');
		} else if(this.isObject(this.object)) {
			this.object["Property" + (Object.keys(this.object).length + 1).toString()] = '';
		} else {
			utils.logError("Could not add new element");
		}
	}

	public addNewArray(): void {
		if (this.isArray(this.object)) {
			(<Array<any>>this.object).push(new Array());
		} else if (this.isObject(this.object)) {
			this.object["Property" + (Object.keys(this.object).length + 1).toString()] = new Array();
		} else {
			utils.logError("Could not add new element");
		}
	}

	public addNewObject(): void {
		if (this.isArray(this.object)) {
			(<Array<any>>this.object).push(new Object());
		} else if (this.isObject(this.object)) {
			this.object["Property" + (Object.keys(this.object).length + 1).toString()] = new Object();
		} else {
			utils.logError("Could not add new element");
		}
	}

	public deleteProperty(property): void{
		if (this.isArray(this.object)) {
			(<Array<any>>this.object).splice((<Array<any>>this.object).indexOf(this.object[property]));
		} else if (this.isObject(this.object)) {
			delete this.object[property]
		}else{
			utils.logError("Could not delete " + property);
		}
	}
}


@Component({
	selector: 'assess-schema',
	directives: [ObjectRendererComponent, NgFor, NgIf],
	templateUrl: './app/templates/assess-schema.html'
})
export class SchemaComponent {

	@Input() schema: Schema;

	constructor() {}
}

@Component({
	selector: 'assess-tab-nav',
	templateUrl: './app/templates/assess-tab-nav.html',
	directives: [NgFor]
})
export class TabNavComponent{
	
	@Input() tabs: {}[];

	constructor(){}

	public ngOnInit(){
		if(this.tabs.length > 0){
			this.select(this.tabs[0]);
		}
	}

	public select(tab: any){
		this.tabs.forEach((tab)=>{
			tab['isSelected'] = false;			
		});
		tab['isSelected'] = true;
		tab.click();
	}
}

@Component({
    selector: 'assess-app',
    templateUrl: './app/templates/assess-app.html',
    directives: [AssetGroupComponent, TabNavComponent, SchemaComponent]
})
export class AppComponent {

	private _assetService: AssetService;

	public MODES = {
		ASSETS 	  : 0,  
		SCHEMA 	  : 1,  
		STRUCTURE : 2,  
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
		}
	];

	constructor(@Inject(AssetService) assetService: AssetService) {
		this._assetService = assetService;
	}
}


