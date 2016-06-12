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

function getLoaderForDataType(AS_ASSET_FIELD_DATA_TYPE: DataType) : string{
	switch (AS_ASSET_FIELD_DATA_TYPE) {
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

export class Loader{
	public name: string;
	public body: string;

	constructor(name:string, generateBody:boolean){
		this.name = name;
		if(generateBody){
			this.body =
			`
exports.create = function create(value) {
	return {
		template: function() {
			return '<input type="text" value="' + value + '"/>'
		},
		setup: function(elem, updateValueFunc) {
			elem.onchange = function(newVal) {
				updateValueFunc(newVal.target.value);
			};
		}
	}
}
			`
		}
	}
}

export class AssetFieldDefinition{
	
	public name: string;
	public AS_ASSET_FIELD_DATA_TYPE: DataType;
	public loader: string;
	public default: any;

	constructor(def:any){
		var missingProps = utils.assertHasProperties(def, ['AS_ASSET_FIELD_NAME', 'AS_ASSET_FIELD_DATA_TYPE']);
		if (missingProps.length > 0) {
			missingProps.forEach(prop => {
				utils.logError("Missing required property " + prop + " for AssetField");

			});
		}else{
			this.name = def.AS_ASSET_FIELD_NAME;
			this.AS_ASSET_FIELD_DATA_TYPE = DataType[<string>def.AS_ASSET_FIELD_DATA_TYPE];
			if(def.hasOwnProperty("default")){
				this.default = def.default;
			}else{
				switch (this.AS_ASSET_FIELD_DATA_TYPE) {
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
			if(!def.hasOwnProperty("AS_ASSET_FIELD_LOADER")){
				this.loader = getLoaderForDataType(this.AS_ASSET_FIELD_DATA_TYPE);
				if (this.loader === null) {
					utils.logError("No loader was provided for AssetType " + this.name + " and no default " +
						"loader was found for data type " + def.AS_ASSET_FIELD_DATA_TYPE);
					return;
				}
			}else{
				this.loader = def.AS_ASSET_FIELD_LOADER;
			}
		}
	}
}

export class AssetTypeDefinition{
	
	public name: string;
	public type: string;
	public fields: AssetFieldDefinition[] = [];

	constructor(def: any){
		var missingProps = utils.assertHasProperties(def, ['AS_ASSET_TYPE_NAME', 'AS_ASSET_TYPE_TYPE', 'AS_ASSET_TYPE_FIELDS']);
		if (missingProps.length > 0) {
			missingProps.forEach(prop => {
				utils.logError("Missing required property " + prop + " for AssetType");
			})
		} else {
			this.name = def.AS_ASSET_TYPE_NAME;
			this.type = def.AS_ASSET_TYPE_TYPE;
			def.AS_ASSET_TYPE_FIELDS.forEach(fieldDef => {
				this.fields.push(new AssetFieldDefinition(fieldDef));
			});
		}
	}
}

export class AssetField{
	
	public definition: AssetFieldDefinition;
	public value: any;
	public create: any;
	public editing: boolean;

	private _loader;

	constructor(def: AssetFieldDefinition, value?: any){
		this.definition = def;
		if (value) {
			this.value = value;
		} else {
			this.value = def.default;
		}
		this._loader = require("./app/loaders/" + def.loader);
		this.create	 = this._loader.create(this.value);
		this.editing = true;
	}

	public toggleEditMode(){
		this.editing = !this.editing;
	}

	public refresh(){
		this.create = this._loader.create(this.value);
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