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

const providers = {
	assetServiceProvider: provide(AssetService, {
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
}

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
    selector: 'assess-app',
    template: '<h4>Assess</h4>',
})
export class AppComponent {

	constructor(){}
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
    directives: [AssetComponent, AssetHeaderComponent, NgFor],
    template: `
    		<table class="asset-group-table" cellpadding=0 cellspacing=0>
    			<thead>
	    			<tr assess-asset-header *ngFor="#assetTypeName of assetService.schema.assetTypeNames" 
	    				[assetType]="assetService.schema.assetTypes[assetTypeName]"></tr>
    			</thead>
    			<tbody>
	    			<tr assess-asset *ngFor="#asset of assetService.assets" [asset]="asset"></tr>
	    		</tbody>
    		</table>`,
    providers: [
		provide(AssetService, providers.assetServiceProvider)
	]
})
export class AssetGroupComponent {

	public assetService: AssetService;

	constructor(@Inject(AssetService) assetService: AssetService) {
		this.assetService = assetService;
	}
}