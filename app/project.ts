declare function require(moduleName: string): any;

import {Injectable, Inject, NgZone} from 'angular2/core';

const fs = require('fs'); 

import * as utils from "./utils";

export class Project{
	
	public filePath: string = null;
	public assetPath: string = null;
	public assetFilePath: string = null;
	public schemaPath: string = null;
	public structurePath: string = null;
	public mappings: {} = {};
	
	constructor(filePath, rawObj?) {
		if (filePath == null || filePath == undefined) {
			utils.logError("File path cannot be null");
			return;
		}
		this.filePath = filePath;
		if (rawObj) {
			for (let prop in rawObj) {
				if (this.hasOwnProperty(prop)) {
					this[prop] = rawObj[prop];
				} else {
					utils.logError("Invalid property " + prop + " in project file");
					return;
				}
			}
		}
	}
}

@Injectable()
export class ProjectService {

 	public currentProject: Project = null;

  	private _zone: NgZone;

	constructor( @Inject(NgZone) _zone: NgZone){
		this._zone = _zone
	}

	public loadProject(filePath: string){
		try {
			var proj = fs.readFileSync(filePath, 'utf8');
			this.currentProject = new Project(filePath, JSON.parse(proj));
		} catch (e) {
			utils.logError("Project file " + filePath + " does not exist");
		}
	}
}