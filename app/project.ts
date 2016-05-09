declare function require(moduleName: string): any;

const fs = require('fs'); 

import * as utils from "./utils";

export namespace ProjectService {
	
	var currentProjectPath: string = null;
	var currentProjectObj: {} = null;

	function loadProject(filePath: string){
		if(fs.exists){
			var proj = fs.readFileSync(filePath, 'utf8');
			currentProjectObj = JSON.parse(proj);
		}else{
			utils.logError("Project file " + filePath + " does not exist");
		}	
	}
}