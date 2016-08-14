import * as utils from './utils' 
import * as Assets from './assetType'


export class Schema{
	
	public assetTypes: {} = {};
	public assetTypeNames: string[] = [];
	public properties: string[] = [];
	public structureStr: string;
	public structureObject: {};
	public rawObject: {};
	public groups: {} = {};

	constructor(schemaAsObj: any, structureStr: string){
		this.structureStr = structureStr;
		this.structureObject = JSON.parse(structureStr);
		this.rawObject = schemaAsObj;
		this.properties = Object.keys(schemaAsObj);
		for (let key in schemaAsObj) {
			let at = schemaAsObj[key];
			this.groups[key] = {
				assetTypes : {},
				assetTypeNames : []
			};
			if (at instanceof Array) {
				at.forEach((typeDef) => {
					this.groups[key].assetTypes[typeDef[Assets.AsFields.AS_ASSET_TYPE_TYPE]] = new Assets.AssetTypeDefinition(typeDef);
					this.groups[key].assetTypeNames.push(typeDef[Assets.AsFields.AS_ASSET_TYPE_TYPE]);
				});
			} else {
				utils.logError("ASSET_TYPES must be an array");
			}
		}
	}
}



