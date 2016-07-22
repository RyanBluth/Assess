declare function require(moduleName: string): any;

import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';

import {NgFor, NgIf, NgModel, NgClass} from 'angular2/common';
import * as Assets from './../assetType';
import * as utils from "./../utils";
import {ProjectService} from './project.service'

import {AssetWriteFormat, Project} from './../project'
import {Schema} from './../schema'

// Node includes
const fs = require('fs'); 
const path = require('path');

/**
* The assest service is setup in bootstrap.ts using the global app injector
* This gives us access to NgZone which we need in order to update things properly 
**/
@Injectable()
export class AssetService{
	public assetGroups : {} = {};
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
	public addAsset(type: string, group:string): void {
		// Need to make sure there is a loaded type definition for the specified type
		if(!this.schema.groups[group].assetTypes.hasOwnProperty(type)){
			utils.logError("Error occured during call to addAsset - type \"" + type + "\" is not specified in the loaded schema");
			return;
		}
		// Run inside the injected NgZone so angular knows to do an update
		this._zone.run(() => {
			// Creeate a new asset object - passing in the type definition from the schema
			this.assetGroups[group].push(new Assets.Asset(this.schema.groups[group].assetTypes[type]));
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
		let assetsObj = JSON.parse(assetsStr);
		this.schema.properties.forEach(p => {
			strucToAssetMap[p] = this.findValueInObject(strucObj, p).reverse();
			console.log(strucToAssetMap);
			let c = null;
			console.log(p);
			console.log(c);
			strucToAssetMap[p].forEach(p => {
				c = assetsObj[p];
				//if(c == null){
				//}else{
				//	c = c[p];
				//}
			});
			if (c != null) {
				let tempAssets = [];
				c.forEach((asset) => {
					console.log(this.schema.groups[p]);
					console.log(asset.AS_ASSET_TYPE_TYPE);
					let a: Assets.Asset = new Assets.Asset(this.schema.groups[p].assetTypes[asset.AS_ASSET_TYPE_TYPE], asset);
					tempAssets.push(a);
				});
				// Run inside angular
				this._zone.run(() => {
					this.assetGroups[p] = tempAssets;
				});
			}
		});
	}

	public assetsForTypeFromGroup(type:string, group : Assets.Asset[]): Assets.Asset[]{
		var ret: Assets.Asset[] = [];
		for(let idx in group){
			if(group[idx].definition.type === type){
				ret.push(group[idx]);
			}
		}
		return ret;
	}

	public retriveValueForSchemaProperty(property: string) : string{
		//if(AS_SchemaTypes.indexOf(property) != -1){
		//	switch (property) {
		//		case "AS_ASSETS":
					let outAssets = [];
					this.assetGroups[property].forEach((asset) => {
						let outAsset = {};
						outAsset["AS_ASSET_TYPE_TYPE"] = asset.definition.type;

						for (let key in asset.fields) {
							outAsset[key] = asset.fields[key].value;
						}
						outAssets.push(outAsset);
					});
					return JSON.stringify(outAssets, null, "\t");
		//	}
		//}else{
			// @TODO Retrive custom properties
		//	return '"DDDDDD"';
		//}
		//return "";
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
		this._projectService.writeProjectFile();
		utils.logInfo("Saved project file " + this._projectService.currentProject.filePath);
	}

	public getAssetGroupNames() : string[]{
		return Object.keys(this.assetGroups);
	}
}