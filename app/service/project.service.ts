
declare function require(moduleName: string): any;
declare var __dirname;

import {Injectable, Inject, NgZone} from '@angular/core';
import * as Assets from './../assetType';
import {Schema} from './../schema';

const fs = require('fs'); 
const path = require('path');

import * as utils from "./../utils";
import {Project} from './../project'

import {GlobalEventService, GlobalEvent} from './globalEvent.service'

@Injectable()
export class ProjectService {

 	public currentProject: Project = null;

  	private _zone: NgZone;
  	private _globalEventService:GlobalEventService;

  	private _defaultSchema = {
		AS_ASSETS: []
  	};

	private _defaultStructure = {
		assets: "AS_ASSETS"
	};

	private _defaultMappings = {
		AS_ASSETS : "AS_ASSETS",
		AS_ASSET_TYPE_TYPE : "type"
	}

	constructor( @Inject(NgZone) _zone: NgZone, @Inject(GlobalEventService) _globalEventService:GlobalEventService){
		this._zone = _zone
		this._globalEventService = _globalEventService;
	}

	public loadProject(filePath: string){
		this._zone.run(() => {
			try {
				var proj = fs.readFileSync(filePath, 'utf8');
				this.currentProject = new Project(filePath, JSON.parse(proj));
				this._globalEventService.brodcast(GlobalEvent.PROJECT_LOADED, this.currentProject);

			} catch (e) {
				utils.logError("Project file " + filePath + " does not exist");
			}
		});
	}

	public newProject(filePath: string){
		try {
			var name = filePath.split(".")[0];
			var s = name.split(path.sep);
			name = s[s.length - 1];
			var proj = new Project(filePath);
			this.currentProject = proj;
			var pathVal = this.getCurrentProjectDirectory();
			proj.mappings = this._defaultMappings;
			proj.assetPath = "";
			proj.assetFilePath  = name + "-assets.json";
			proj.schema = this._defaultSchema;
			proj.structure = this._defaultStructure;
			proj.loaders = {};
			fs.writeFileSync(filePath, proj.asJson());
		} catch (e) {
			utils.logError("Error creating new project");
		}	
	}

	public getCurrentProjectDirectory() {
		var pathVal = "";
		var pathArr = this.currentProject.filePath.split(path.sep);
		for (let i = 0; i < pathArr.length - 1; ++i) {
			pathVal += pathArr[i] + path.sep;
		}
		return pathVal;
	}

	public writeAssetsFile(value: string){
		for(let key in this.currentProject.mappings){
			value = value.replace(new RegExp('"' + key + '"', 'g'), '"' + this.currentProject.mappings[key] + '"');
		}
		fs.writeFileSync(path.join(this.getCurrentProjectDirectory(), this.currentProject.assetFilePath), value);
	}

	public readAssetsFile(): string{ 
		var fileContents = fs.readFileSync(path.join(this.getCurrentProjectDirectory(), this.currentProject.assetFilePath), 'utf-8');
		for (let key in this.currentProject.mappings) {
			fileContents = fileContents.replace(new RegExp('"' + this.currentProject.mappings[key] + '"', 'g'), '"' + key + '"'); 
		}
		return fileContents;
 	}

 	public writeProjectFile(){
		var json = JSON.stringify(this.currentProject);
		fs.writeFileSync(this.currentProject.filePath, json);
 	}

	public getProjectFolderRelative():string{
  		var p:string = null;
	  	if(this.currentProject != null){
			var filePathParts:string[] = this.currentProject.filePath.split(path.sep);
			p = filePathParts.reduce((prev:string, curr:string, index:number, array:string[]):string=>{
				var ret = prev;
				if(index < array.length - 1){
					ret += path.sep + curr;
				}				
				return ret;
			});
			p = path.relative(__dirname, p);
	  	}
		return p;
 	}

	public resolveAbsoluteAssetFilePath(asset: string): string{
		var absAssetFolder = this.getCurrentProjectDirectory() + path.sep + this.currentProject.assetPath;
		return absAssetFolder + path.sep + asset;
	}

	public resolveRelativeAssetFilePath(asset:string): string{
		var absAssetFolder = this.getCurrentProjectDirectory() + path.sep + this.currentProject.assetPath;
		return path.relative(absAssetFolder, asset);
	}
}
