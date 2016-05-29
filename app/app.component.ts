declare function require(moduleName: string): any;

import {globalAppInjector} from "./bootstrap"

import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit} from 'angular2/core';

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

export var AsFields = {
	SCHEMA : {
		AS_ASSETS: "AS_ASSETS", // An Array of asset types
		AS_ASSET_TYPE_NAME: "AS_ASSET_TYPE_NAME", // The display name for an asset type
		AS_ASSET_TYPE_TYPE: "AS_ASSET_TYPE_TYPE", // The type for an asset type
		AS_ASSET_TYPE_FIELDS: "AS_ASSET_TYPE_FIELDS", // An array of field definitions for an asset type
		AS_ASSET_FIELD_NAME: "AS_ASSET_FIELD_NAME", // The name of a an asset type field 
		AS_ASSET_FIELD_DATA_TYPE: "AS_ASSET_FIELD_DATA_TYPE", // The data type of a field 
		AS_ASSET_FIELD_LOADER: "AS_ASSET_FIELD_LOADER", // The loader for the asset type field
	}
}


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

export class Schema{
	
	public assetTypes: {} = {};
	public assetTypeNames: string[] = [];
	public properties: string[] = [];
	public structureStr: string;
	public structureObject: {};
	public rawObject: {};

	constructor(schemaAsObj: any, structureStr: string){
		this.structureStr = structureStr;
		this.structureObject = JSON.parse(structureStr);
		this.rawObject = schemaAsObj;
		this.properties = Object.keys(schemaAsObj);
		if (schemaAsObj.hasOwnProperty(Assets.SchemaFields[Assets.SchemaFields.AS_ASSETS])){
			let at = schemaAsObj[Assets.SchemaFields[Assets.SchemaFields.AS_ASSETS]]; 
			if(at instanceof Array){
				at.forEach((typeDef) => {
					this.assetTypes[typeDef["AS_ASSET_TYPE_TYPE"]] = new Assets.AssetTypeDefinition(typeDef);
					this.assetTypeNames.push(typeDef["AS_ASSET_TYPE_TYPE"]);
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
	}

	public loadLastProject(){
		var lastProject = window.localStorage.getItem('lastProject');
		if (lastProject != null && lastProject != undefined) {
			try {
				fs.accessSync(lastProject); // Check for file access
				this._projectService.loadProject(lastProject);
				this.loadProject(this._projectService.currentProject);
			} catch (ignored) {/*Fail silently*/ }
		}
	}

	public loadProject(config: Project){
		// Run inside the injected NgZone so angular knows to do an update
		this._zone.run(() => {
			this.schema = new Schema(config.schema, JSON.stringify(config.structure, null, "\t"));
			this.readAssets(config.assetFilePath);
			utils.logInfo("Opened project " + config.filePath);
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
						outAsset["AS_ASSET_TYPE_TYPE"] = asset.definition.type;

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

	public writeProjectFile(){
		this._projectService.writeProjectFile(this.schema);
		utils.logInfo("Saved project file " + this._projectService.currentProject.filePath);
	}
}

export enum GlobalEvent {
	GLOBAL_CLICK = 0,
	SCHEMA_CHANGE = 1,
	ERROR_MESSAGE = 2,
	INFO_MESSAGE = 3
}

@Injectable()
export class GlobalEventService {

	private _elemRef: any
	private _zone: NgZone;
	private _assetService: AssetService;

	private _emitters = {
		"GLOBAL_CLICK"  : new EventEmitter(),
		"SCHEMA_CHANGE" : new EventEmitter(),
		"ERROR_MESSAGE" : new EventEmitter(),
		"INFO_MESSAGE"  : new EventEmitter(),
	}

	constructor( @Inject(NgZone) _zone: NgZone, @Inject(AssetService) _assetService: AssetService) {
		this._zone = _zone;
		this._assetService = _assetService;
	}

	public hookupAppElement(app: AppComponent) {
		this._elemRef = app.getElement();
		this._elemRef.onclick = (e) => {
			this._zone.run(() => {
				this._emitters[GlobalEvent[GlobalEvent.GLOBAL_CLICK]].emit(e);
			});
		}
	}

	public subscribe(event: GlobalEvent, func: (data: any) => void) {
		this._emitters[GlobalEvent[event]].subscribe(func);
	}

	public brodcast(event: GlobalEvent, data:any = null) {
		this._zone.run(() => {
			this._emitters[GlobalEvent[event]].emit(data);
		});
	}
}


export class PopupOption{

	public onClick: ()=>void;
	public label: string;

	constructor(label: string, onClick:()=>void){
		this.label = label;
		this.onClick = onClick;
	}
}


@Directive({
	selector: '[assess-adjusting-input]'
})
export class AdjustingInputDirective implements OnInit {
	
	private _elem: any;
	private _dummySpan: any;

	constructor(elem: ElementRef){
		this._elem = elem.nativeElement;
	}

	public ngOnInit() {
		this._dummySpan = document.createElement("span");
		var fontSize = window.getComputedStyle(this._elem, null).getPropertyValue('font-size');
		this._dummySpan.style.fontSize = fontSize;
		this._elem.parentElement.appendChild(this._dummySpan);
		this._dummySpan.innerHTML = this._elem.value;
		this._elem.addEventListener("keydown", (e) => {
			this._dummySpan.innerHTML = e.target.value;
			this.updateWidth();
		});
		this.updateWidth();
	}

	private updateWidth(){
		this._dummySpan.style.display = "inline-block"; 
		this._elem.style.width = this._dummySpan.offsetWidth + 20 + "px";
		this._dummySpan.style.display = "none"; 
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
	selector: 'assess-popup',
	templateUrl: './app/templates/assess-popup.html',
	directives: [NgFor, NgIf]
})
export class PopupComponent {

	@Input() options: PopupOption[];
	@Input() icon: string;

	public hidden = true;

	constructor( @Inject(GlobalEventService) globalEventService: GlobalEventService) {
		globalEventService.subscribe(GlobalEvent.GLOBAL_CLICK, (event) => {
			if (!this.hidden) {
				this.toggleHidden();
			}
		});
	}

	public clickOption(option){
		option.onClick(); 
		this.toggleHidden(); 
	}

	public toggleHidden(){
		this.hidden = !this.hidden;
	}
}

@Component({
	selector: 'assess-object-renderer',
	templateUrl: './app/templates/assess-object-renderer.html',
	directives: [NgFor, NgIf, NgModel, ObjectRendererComponent, PopupComponent, AdjustingInputDirective]
})
export class ObjectRendererComponent implements OnInit, AfterContentChecked {

	@Input() object: {}[];
	@Input() bracketIndex: number;

	public collapsed = false;

	private _zone: NgZone;
	private _sortedFields: any[] = [];
	private _closingBracket: boolean = false;
	private _globalEventService: GlobalEventService;
	private _bracketColors = [
		"#ff0000",
		"#00ff00",
		"#0000ff",
	];

	constructor( @Inject(GlobalEventService) _globalEventService: GlobalEventService, _zone: NgZone) {
		this._globalEventService = _globalEventService;
		this._zone = _zone;
	}

	public ngOnInit() {
		this._sortedFields = Object.keys(this.object);
	}

	public ngAfterContentChecked() {
		var keys = Object.keys(this.object);
		var diff = keys.length - this._sortedFields.length;
		if (diff > 0) {
			this._sortedFields.push(keys[keys.length - 1]);
		}
	}

	public objectProperties(): string[] {
		return this._sortedFields;
	}

	public isArray(val): boolean {
		return val instanceof Array && !(val instanceof String);
	}

	public isObject(val): boolean {
		return (val instanceof Object) && !(val instanceof Array) && !(val instanceof String);
	}

	public isInteger(val): boolean {
		return !isNaN(val);
	}

	public toggleCollapse(): void {
		this.collapsed = !this.collapsed;
	}

	public getColorForType(prop) {
		return typeof this.object[prop];
	}

	public updateKey(key, event) {
		if (event.target.value.length == 0) {
			event.srcElement.value = key;
			utils.logError("Key cannot be a blank value");
			return;
		}
		if (!this.object.hasOwnProperty(event.target.value)) {
			var val = this.object[key];
			delete this.object[key];
			this.object[event.target.value] = val;
			this._sortedFields[this._sortedFields.indexOf(key)] = event.target.value;
		} else {
			utils.logError("Can't update value. Property " + event.target.value + " already exists");
			event.srcElement.value = key;
		}

	}

	public addNewProperty(property): void {
		if (this.isArray(this.object[property])) {
			(<Array<any>>this.object[property]).push('');
		} else if (this.isObject(this.object[property])) {
			var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
			this.object[property][newKey] = "";
		} else {
			utils.logError("Could not add new element");
		}
	}

	public addNewArray(property): void {
		if (this.isArray(this.object[property])) {
			(<Array<any>>this.object[property]).push(new Array());
		} else if (this.isObject(this.object[property])) {
			var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
			this.object[property][newKey] = new Array();
		} else {
			utils.logError("Could not add new element");
		}

	}

	public addNewObject(property): void {
		if (this.isArray(this.object[property])) {
			(<Array<any>>this.object[property]).push(new Object());
		} else if (this.isObject(this.object[property])) {
			var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
			this.object[property][newKey] = new Object();
		} else {
			utils.logError("Could not add new element");
		}
	}

	public deleteProperty(property): void {
		if (this.isArray(this.object)) {
			(<Array<any>>this.object).splice(property, 1);
			this._sortedFields = [];
			for (let i = 0; i < (<Array<any>>this.object).length; ++i) {
				this._sortedFields.push(i);
			}
		} else if (this.isObject(this.object)) {
			delete this.object[property];
			this._sortedFields.splice(this._sortedFields.indexOf(property), 1);
		} else {
			utils.logError("Could not delete " + property);
		}
	}

	public getOptionsForProperty(property): PopupOption[] {
		var options = [];
		if (this.isArray(this.object[property])) {
			options.push(
				new PopupOption("New Element", () => { this.addNewProperty(property) }),
				new PopupOption("New Object", () => { this.addNewObject(property) }),
				new PopupOption("New Array", () => { this.addNewArray(property) }),
				new PopupOption("Delete", () => { this.deleteProperty(property) })
			);
		} else if (this.isObject(this.object[property])) {
			options.push(
				new PopupOption("New Property", () => { this.addNewProperty(property) }),
				new PopupOption("New Object", () => { this.addNewObject(property) }),
				new PopupOption("New Array", () => { this.addNewArray(property) }),
				new PopupOption("Delete", () => { this.deleteProperty(property) })
			);
		} else {
			options.push(
				new PopupOption("Delete", () => { this.deleteProperty(property) })
			);
		}

		if (property == AsFields.SCHEMA.AS_ASSETS) {
			options.push(new PopupOption("New Asset Type", () => {
				this.object[AsFields.SCHEMA.AS_ASSETS].push(
					{
						AS_ASSET_TYPE_NAME: "Display Name",
						AS_ASSET_TYPE_TYPE: "Asset Type",
						AS_ASSET_TYPE_FIELDS: []
					}
				);
			}))
		}

		if (property == AsFields.SCHEMA.AS_ASSET_TYPE_FIELDS) {
			options.push(new PopupOption("New Field", () => {
				this.object[AsFields.SCHEMA.AS_ASSET_TYPE_FIELDS].push(
					{
						AS_ASSET_FIELD_DATA_TYPE: "AS_STRING",
						AS_ASSET_FIELD_NAME: "Field Name"
					}
				);
			}))
		}

		return options;
	}

	public getCompletionsForProperty(property): PopupOption[] {
		var options: PopupOption[] = [];

		if(property == AsFields.SCHEMA.AS_ASSET_FIELD_DATA_TYPE){
			options.push(
				new PopupOption("AS_STRING", () => { this.object[property] = "AS_STRING" }),
				new PopupOption("AS_BOOLEAN", () => { this.object[property] = "AS_BOOLEAN" }),
				new PopupOption("AS_FLOAT", () => { this.object[property] = "AS_FLOAT" }),
				new PopupOption("AS_INT", () => { this.object[property] = "AS_INT" })
			);
		}

		return options;
	}

	public getBracketColor(): string {
		if (this.bracketIndex >= this._bracketColors.length) {
			this.bracketIndex = 0;
		}
		var color = this._bracketColors[this.bracketIndex];
		if (this._closingBracket) {
			this.bracketIndex++;
		}
		this._closingBracket = !this._closingBracket;
		return color;
	}
}


@Component({
	selector: 'assess-schema',
	directives: [ObjectRendererComponent, NgFor, NgIf],
	templateUrl: './app/templates/assess-schema.html'
})
export class SchemaComponent {

	private _assetService: AssetService;
	private _globalEventService: GlobalEventService;
	private _originalSchema: {} = null// Copy of the original schema so we can watch for changes

	@Input() schemaObject: {};

	constructor(@Inject(AssetService) _assetService:AssetService, 
		@Inject(GlobalEventService) _globalEventService: GlobalEventService) 
	{
		this._assetService = _assetService;
		this._globalEventService = _globalEventService;
	}

	public ngOnInit(){
		if (this._originalSchema === null) {
			this._originalSchema = jQuery.extend(true, {}, this.schemaObject);
		}
	}

	public ngDoCheck() {
		if(!utils.looseEquals(this.schemaObject, this._originalSchema)){
			// Update schema copy
			this._originalSchema = jQuery.extend(true, {}, this.schemaObject);
			// Brodacast that the schema has changed
			this._globalEventService.brodcast(GlobalEvent.SCHEMA_CHANGE);
		}
	}

	public saveSchema(){
		this._assetService.writeProjectFile();
		this._assetService.loadLastProject();
	}
}

@Component({
	selector: 'assess-structure',
	directives: [ObjectRendererComponent, NgFor, NgIf],
	templateUrl: './app/templates/assess-structure.html'
})
export class StructureComponent {

	@Input() structure: {};

	constructor() { }
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
	selector: 'assess-console',
	templateUrl: './app/templates/assess-console.html'
})
export class ConsoleComponent{
	
	static ERROR: string = "error";
	static INFO : string = "info";

	private _globlaEventService: GlobalEventService;
	private _ref: any;
	private _zone: NgZone;

	private _lastResize:number = 0;

	public messages: {}[] = []; // Object format = { text:'some text', severity: 'ERROR, INFO'}

	constructor(
		@Inject(GlobalEventService) _globalEventService: GlobalEventService,
		_ref: ElementRef, 
		_zone: NgZone) 
	{
		this._ref = _ref.nativeElement;
		this._globlaEventService = _globalEventService;
		this._zone = _zone;
		
		this._globlaEventService.subscribe(GlobalEvent.ERROR_MESSAGE, (data) => { 
			this.messages.push({
				text: this.formatTimeStamp(data.time) + " - " + data.text,
				severity: ConsoleComponent.ERROR
			});
		});

		this._globlaEventService.subscribe(GlobalEvent.INFO_MESSAGE, (data) => {
			this.messages.push({
				text: this.formatTimeStamp(data.time) + " - " + data.text,
				severity: ConsoleComponent.INFO
			});
		});
	}

	public updateConsoleSize(event){
		this._zone.runOutsideAngular(()=>{
			var now = Date.now();
			if (now - this._lastResize > 33 && event.screenY > 0) {
				this._ref.children[0].style.height = screen.height - event.screenY - 40 + "px";
				this._lastResize = now;
			}
		});
	}

	private formatTimeStamp(date: Date): string{
		var m = date.getMinutes().toString();
		m = m.length == 1 ? "0" + m : m; 
		var s = date.getSeconds().toString();
		s = s.length == 1 ? "0" + s : s; 
		return date.getHours() + ":" + m + ":" + s;
	}
}

@Component({
    selector: 'assess-app',
    templateUrl: './app/templates/assess-app.html',
    directives: [AssetGroupComponent, TabNavComponent, 
    	SchemaComponent, StructureComponent, 
    	ConsoleComponent, AdjustingInputDirective]
})
export class AppComponent {

	private _assetService: AssetService;
	private _globalEventService: GlobalEventService;
	private _elem: ElementRef;

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

	constructor(
		elem: ElementRef,
		@Inject(AssetService) assetService: AssetService, 
		@Inject(GlobalEventService) globalEventService: GlobalEventService) 
	{
		this._elem = elem.nativeElement;
		this._assetService = assetService;
		this._globalEventService = globalEventService;
		this._globalEventService.hookupAppElement(this);
	}

	public getElement(): any{
		return this._elem;
	}

	public initialize(){
		this._assetService.loadLastProject();
	}
}


