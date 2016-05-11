declare function require(moduleName: string): any;

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
		if (!filePath) {
			utils.logError("File path cannot be null");
			return;
		}
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

export namespace ProjectService {

 	export var currentProject: Project = null;

	export function loadProject(filePath: string){
		if(fs.exists){
			var proj = fs.readFileSync(filePath, 'utf8');
			currentProject = new Project(filePath, JSON.parse(proj));
		}else{
			utils.logError("Project file " + filePath + " does not exist");
		}	
	}
}