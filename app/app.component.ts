declare function require(moduleName: string): any;

import {ElementRef, provide, Component, Injector, Provider, Inject, Input, Output, Optional, Injectable, AfterViewChecked} from 'angular2/core';
import {NgFor} from 'angular2/common';
import * as Assets from './assetType';
import * as utils from "./utils";

const fs = require('fs'); 
const electron = require('electron');

var currentProjectPath = null; // Current Project File Path

const AS_SchemaTypes: string[] = [
	"AS_ASSETS"
];

export class ProjectConfig{
	public schemaPath: string;
	public assetsPath: string;
	public structurePath: string;
	public mappings: {};
}

export enum AssetWriteFormat{
	JSON
}

export class Schema{
	
	public assetTypes: {} = {};
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
				});
			}else{
				utils.logError("ASSET_TYPES must be an array");
			}
		}
	}
}

export function loadProject() : ProjectConfig{
	var data = fs.loadFileSync(currentProjectPath, "utf8");
	data = JSON.parse(data);
	var pc = new ProjectConfig();
	pc.assetsPath    = data["assetPath"]     || null;
	pc.schemaPath    = data["schemaPath"]    || null;
	pc.structurePath = data["structurePath"] || null;
	pc.structurePath = data["mappings"]      || null;
	return pc;
}

@Injectable()
export class AssetService{
	public assets: Assets.Asset[] = [];
	public assetTypeDefinitions: any;

	public schema: Schema;
	public assetsAsObj: any; // Asset file loaded as object

	constructor(config:ProjectConfig){
		if(config){
			this.loadProject(config);
		}
	}

	public loadProject(config: ProjectConfig){
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
		this.schema = new Schema(JSON.parse(data), struc);
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
		// Creeate a new asset object - passing in the type definition from the schema
		this.assets.push(new Assets.Asset(this.schema.assetTypes[type]));
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
		c.forEach((asset) => {
			let a:Assets.Asset = new Assets.Asset(this.schema.assetTypes[asset.type], asset);
			this.assets.push(a);
		});
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
					return JSON.stringify(outAssets);
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
    selector: 'assess-app',
    template: '<h4>Assess</h4>',
})
export class AppComponent {

	constructor(){}
}


@Component({
	selector: 'asses-asset-field',
	template: '<div [innerHTML]="field.editing ? field.edit.template : field.preview.template"></div>'
})
export class AssetFieldComponent implements AfterViewChecked {
	@Input() field: any;

	private elem: ElementRef;

	constructor(elem: ElementRef){
		this.elem = elem.nativeElement;
	}

	public ngAfterViewChecked() {
		this.field.preview.run(this.elem);
	}

	public updateState(){
		if(this.field.editing){
			this.field.edit.run(this.elem);
		}else{
			this.field.edit.run(this.elem);
		}
	}
}


@Component({
	selector: 'assess-asset',
	directives: [AssetFieldComponent],
	templateUrl: './app/templates/assess-asset.html'
})
export class AssetComponent{
	
	@Input() asset : Assets.Asset;

	constructor() {}
}

@Component({
    selector: 'assess-asset-group',
    directives: [AssetComponent, NgFor],
    template: '<div *ngFor="#asset of assetService.assets"><assess-asset [asset]="asset"></assess-asset></div>',
    providers: [
		provide(AssetService, {
			useFactory: () => {
				// Load project configuration stuff here
				var pc = new ProjectConfig();
				pc.assetsPath = "/assets.json";
				pc.schemaPath = "C:/Projects/Assess/test-schema.json";
				pc.structurePath = "C:/Projects/Assess/test-structure.json";

				var assetService: AssetService = new AssetService(pc);
		
				assetService.readAssets("C:/Projects/Assess/assets.json");

				assetService.writeAssets(AssetWriteFormat.JSON);
				return assetService;
			}
		})
	]
})
export class AssetGroupComponent {

	public assetService: AssetService;

	constructor(@Inject(AssetService) assetService: AssetService) {
		this.assetService = assetService;
	}
}