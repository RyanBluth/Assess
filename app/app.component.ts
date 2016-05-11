declare function require(moduleName: string): any;

import {appInjector} from "./bootstrap"
import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, ApplicationRef, Provider, Inject, Input, Output, Optional, Injectable, AfterViewChecked} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import * as Assets from './assetType';
import * as utils from "./utils";
import {ProjectService, Project} from './project'

const fs = require('fs'); 
const electron = require('electron');

const remote = require('remote');
const { BrowserWindow } = require('electron').remote;
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');
const { dialog } = require('electron').remote;

var mainWindow = BrowserWindow.fromId(1);

var currentProjectPath = null; // Current Project File Path

const AS_SchemaTypes: string[] = [
	"AS_ASSETS"
];

// Setup menu
var template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Project',
				accelerator: 'Command+N'
			},
			{
				type: 'separator'
			},
			{
				label: 'Open Project',
				accelerator: 'Command+o',
				click: function() {
					dialog.showOpenDialog(
						{ properties: ['openFile'], filters: [{ name: 'JSON', extensions: ['json'] }] },
						(file) => {
							if (file != undefined) {
								ProjectService.loadProject(file.toString());
								appInjector.get(AssetService).loadProject(ProjectService.currentProject);
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

export enum AssetWriteFormat{
	JSON
}

export class Schema{
	
	public assetTypes: {} = {};
	public assetTypeNames: string[] = [];
	public properties: string[] = [];
	public structureStr: string;

	constructor(schemaAsObj: any, structureStr: string){
		this.structureStr = structureStr;
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

@Injectable()
export class AssetService{
	public assets: Assets.Asset[] = [];
	public assetTypeDefinitions: any = null;

	public schema: Schema = null;
	public assetsAsObj: any = null; // Asset file loaded as object

	private zone: NgZone;// Angular zone

	constructor(@Inject(NgZone)zone: NgZone){
		this.zone = zone
	}

	public loadProject(config: Project){
		// Load schema
		// populate AssetTypeDefinitions as object keyed by type
		let data = fs.readFileSync(config.schemaPath, 'utf8');
		if (!data) {
			utils.logError("Error reading schema file");
			return;
		}
		let struc = fs.readFileSync(config.structurePath, 'utf8');
		if (!struc) {
			utils.logError("Error reading structure file");
			return;
		}
		// Run inside the injected NgZone so angular knows to do an update
		this.zone.run(() => {
			this.schema = new Schema(JSON.parse(data), struc);
			this.readAssets(config.assetFilePath);
		});
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
		this.zone.run(() => {
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

		fs.writeFileSync("C:/Projects/Assess/assets.json", outStructureStr);
	}

	public readAssets(inputPath?: string) : void{
		let assetsStr = fs.readFileSync(inputPath, 'utf8');

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

		var tempAssets = [];
		c.forEach((asset) => {
			let a:Assets.Asset = new Assets.Asset(this.schema.assetTypes[asset.type], asset);
			tempAssets.push(a);
		});
		// Run inside angular
		this.zone.run(() => { 
			this.assets = tempAssets;
		});
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

	public findValueInObject(obj: any, property: string, path: any[] = []): any[] {
		for(let x in obj){;
			let val = obj[x];
			if (val == property){
				path.push(x);
				return path;
			}
			else if(val != null && typeof val == 'object'){
				let v = this.findValueInObject(val, property, path);
				if(v != null){
					path.push(x);	
					return path;
				}
			}
		}
		return null;
	}
}

@Component({
	selector: '[asses-asset-field]',
	template: '<div class="asset-field" [outerHTML]="field.create.template"></div>',
})
export class AssetFieldComponent implements AfterViewChecked {
	@Input() field: Assets.AssetField;

	private elem: any;
	private assetService: AssetService;

	constructor(elem: ElementRef, @Inject(AssetService) assetService: AssetService) {
		this.elem = elem.nativeElement;
		this.assetService = assetService;
	}

	public ngAfterViewChecked() {
		this.field.create.setup(this.elem, (value) => {this.updateValue(value)});
	}

	public updateValue(value){
		this.field.value = value;
		this.assetService.writeAssets(AssetWriteFormat.JSON);
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
    template: `
    		<h1>Assets</h1>
    		<div *ngIf="assetService.schema != null">
	    		<div class="asset-group" *ngFor="#assetTypeName of assetService.schema.assetTypeNames"> 
	    			<div class="asset-type-title"><span>{{assetService.schema.assetTypes[assetTypeName].name}}s</span></div> 
		    		<table class="asset-group-table" cellpadding=0 cellspacing=0>
		    			<thead>
			    			<tr assess-asset-header [assetType]="assetService.schema.assetTypes[assetTypeName]"></tr>
		    			</thead>
		    			<tbody>
			    			<tr assess-asset *ngFor="#asset of assetService.assetsForType(assetTypeName)" [asset]="asset"></tr>
			    		</tbody>
		    		</table>
		    		<button class="new-asset-btn" (click)="assetService.addAsset(assetTypeName)">New</button>
	    		</div>
    		</div>`,
    //providers: [AssetService]
})
export class AssetGroupComponent {

	public assetService: AssetService;

	constructor( @Inject(AssetService) assetService: AssetService) {
		this.assetService = assetService; 
	}
}

@Component({
    selector: 'assess-app',
    template: '<assess-asset-group class="asset-list-container"></assess-asset-group>',
    directives: [AssetGroupComponent]
})
export class AppComponent {

	constructor() { }
}
