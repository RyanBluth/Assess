import * as Utils from './utils'

export class Project{
	
	public filePath: string = null;
	public assetPath: string = null;
	public assetFilePath: string = null;
	public schema: {} = {};
	public structure: {} = {};
	public mappings: {} = {};
	public loaders: {} = {};
	
	constructor(filePath, rawObj?) {
		if (filePath == null || filePath == undefined) {
			Utils.logError("File path cannot be null");
			return;
		}
		this.filePath = filePath;
		if (rawObj) {
			for (let prop in rawObj) {
				if (this.hasOwnProperty(prop)) {
					this[prop] = rawObj[prop];
				} else {
					Utils.logError("Invalid property " + prop + " in project file");
					return;
				}
			}
		}
	}

	public asJson(){
		return JSON.stringify({
			assetPath: this.assetPath,
			assetFilePath: this.assetFilePath,
			schema: this.schema,
			structure: this.structure,
			mappings: this.mappings,
			loaders: this.loaders,
		}, null, "\t");
	}
}

export enum AssetWriteFormat {
	JSON
}