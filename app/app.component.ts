declare function require(moduleName: string): any;

import {provide, Component, Injector, Provider, Inject, Input, Output, Optional, Injectable} from 'angular2/core';
import {NgFor} from 'angular2/common';
import * as Assets from './assetType';
import * as utils from "./utils";

const fs = require('fs'); 
const electron = require('electron');

export class ProjectConfig{
	public schemaPath: string;
	public assetsPath: string;
}

export enum AssetWriteFormat{
	JSON
}

/**
 * @brief Defines the structure of the asset strore and its data types
 * 
 * The following attributes may be specifed
 * ASSET_TYPES - An array specifing the asset types and their formats. An example would be as follows 
 * "ASSET_TYPES": [
 *   {
 *     "name": "Image",
 *     "type": "IMAGE",
 *     "fields": [
 *       {
 *         "dataType": "AS_FILE",
 *         "name": "src",
 *         "extensions": [
 *           "png",
 *           "jpg",
 *           "gif"
 *         ],
 *         "loader": "loaders/imageLoader.js"
 *       },
 *       {
 *         "dataType": "AS_STRING",
 *         "name": "Description",
 *         "loader": "loaders/imageLoader.js"
 *       }
 *     ]
 *   }
 * ] 
 */
export class Schema{
	
	public assetTypes: {} = {};

	constructor(schemaAsObj: any){
		if (schemaAsObj.hasOwnProperty(Assets.SchemaFields[Assets.SchemaFields.AS_ASSET_TYPES])){
			let at = schemaAsObj[Assets.SchemaFields[Assets.SchemaFields.AS_ASSET_TYPES]]; 
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
		this.schema = new Schema(JSON.parse(data));
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
		let outAssets = [];
		this.assets.forEach((asset) => {
			let outAsset = {};
			outAsset["type"] = asset.definition.type;
		
			for(let key in asset.fields){
				outAsset[key] = asset.fields[key].value;
			}
			outAssets.push(outAsset);
 		});
		fs.writeFileSync("C:/Projects/Asses/assets.json", JSON.stringify(outAssets));
	}

	public readAssets(inputPath?: string) : void{
		let assetsObj = fs.readFileSync(inputPath, 'utf8');
		assetsObj = JSON.parse(assetsObj);
		assetsObj.forEach((asset) => {
			let a:Assets.Asset = new Assets.Asset(this.schema.assetTypes[asset.type], asset);
			this.assets.push(a);
		});
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
	selector: 'assess-asset',
	templateUrl: './app/templates/assess-asset.html'
})
export class AssetComponent{
	
	@Input() asset : Assets.Asset;

	constructor(){
		console.log(this.asset);
	}
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
				pc.schemaPath = "C:/Projects/Asses/test-schema.json";

				var assetService: AssetService = new AssetService(pc);
				assetService.readAssets("C:/Projects/Asses/assets.json");
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