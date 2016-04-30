declare function require(moduleName: string): any;

import * as utils from "./utils";

export enum DataType{
	AS_STRING,
	AS_INT,
	AS_FLOAT,
	AS_FILE,
	AS_SELECT,
	AS_BOOLEAN
}

export enum SchemaFields{
	AS_ASSETS
}

function getLoaderForDataType(dataType: DataType) : string{
	switch (dataType) {
		case DataType.AS_STRING:
			return "default/asDefaultStringLoader.js";
		case DataType.AS_INT:
			return "default/asDefaultIntLoader.js";
		case DataType.AS_FLOAT:
			return "default/asDefaultFloatLoader.js";
		case DataType.AS_SELECT:
			return "default/asDefaultSelectLoader.js";
		case DataType.AS_BOOLEAN:
			return "default/asDefaultBooleanLoader.js";
		default:
			return null;
	}
}

export class AssetFieldDefinition{
	
	public name: string;
	public dataType: DataType;
	public loader: string;
	public default: any;

	constructor(def:any){
		var missingProps = utils.assertHasProperties(def, ['name', 'dataType']);
		if (missingProps.length > 0) {
			missingProps.forEach(prop => {
				utils.logError("Missing required property " + prop + " for AssetField");

			});
		}else{
			this.name = def.name;
			this.dataType = DataType[<string>def.dataType];
			if(def.hasOwnProperty("default")){
				this.default = def.default;
			}else{
				switch (this.dataType) {
					case DataType.AS_STRING:
						this.default = "";
						break;
					case DataType.AS_INT:
						this.default = 0;
						break;
					case DataType.AS_FLOAT:
						this.default = 0.0;
						break;
					case DataType.AS_SELECT:
						this.default = [];
						break;
					case DataType.AS_BOOLEAN:
						this.default = false;
						break;
					default:
						this.default = null;
				}
			}
			if(!def.hasOwnProperty("loader")){
				this.loader = getLoaderForDataType(this.dataType);
				if (this.loader === null) {
					utils.logError("No loader was provided for AssetType " + this.name + " and no default " +
						"loader was found for data type " + def.dataType);
					return;
				}
			}else{
				this.loader = def.loader;
			}
		}
	}
}

export class AssetTypeDefinition{
	
	public name: string;
	public type: string;
	public fields: AssetFieldDefinition[] = [];

	constructor(def: any){
		var missingProps = utils.assertHasProperties(def, ['name', 'type', 'fields']);
		if (missingProps.length > 0) {
			missingProps.forEach(prop => {
				utils.logError("Missing required property " + prop + " for AssetType");
			})
		} else {
			this.name = def.name;
			this.type = def.type;
			def.fields.forEach(fieldDef => {
				this.fields.push(new AssetFieldDefinition(fieldDef));
			});
		}
	}
}

export class AssetField{
	
	public definition: AssetFieldDefinition;
	public value: any;
	public preview: any;
	public edit: any;
	public editing: boolean;

	constructor(def: AssetFieldDefinition, value?: any){
		this.definition = def;
		if (value) {
			this.value = value;
		} else {
			this.value = def.default;
		}
		let p = require("./app/loaders/" + def.loader);
		this.preview = p.preview(this.value);
		this.edit 	 = p.edit(this.value);
		this.editing = true;
	}

	public toggleEditMode(){
		this.editing = !this.editing;
	}
}

export class Asset{

	public definition: AssetTypeDefinition;
	public fields: {} = {};

	constructor(def: AssetTypeDefinition, fieldValues?: {}) {
		this.definition = def;
		// Instantiate the asset fields with null values so they are assigned defaults
		def.fields.forEach(field => {
			var val = null;
			if(fieldValues && fieldValues.hasOwnProperty(field.name)){
				val = fieldValues[field.name];
			}
			this.fields[field.name] = new AssetField(field, val);
		});
	}

	public getFieldKeys(){
		return Object.keys(this.fields);
	}

	public isFieldDefined(fieldName:string) : boolean {
		this.definition.fields.forEach((field) => {
			if(field.name === fieldName){
				return true;
			}
		});
		return false;
	}
}