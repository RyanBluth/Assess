declare function require(moduleName: string): any;

import {globalAppInjector} from "./bootstrap"
import {ProjectService} from "./service/project.service"

const fs = require('fs');
const requireFromString = require('require-from-string');

import * as utils from "./utils";

export var DataType = {
	AS_STRING  : "as_string",
	AS_INT     : "as_int",
	AS_FLOAT   : "as_float",
	AS_FILE    : "as_file",
	AS_SELECT  : "as_select",
	AS_BOOLEAN : "as_boolean"
}

export var AsFields = {
	AS_ASSETS: "as_assets", // An Array of asset types
	AS_ASSET_TYPE_NAME: "as_asset_type_name", // The display name for an asset type
	AS_ASSET_TYPE_TYPE: "as_asset_type_type", // The type for an asset type
	AS_ASSET_TYPE_FIELDS: "as_asset_type_fields", // An array of field definitions for an asset type
	AS_ASSET_FIELD_NAME: "as_asset_field_name", // The name of a an asset type field 
	AS_ASSET_FIELD_DATA_TYPE: "as_asset_field_data_type", // The data type of a field 
	AS_ASSET_FIELD_LOADER: "as_asset_field_loader", // The loader for the asset type field
}


export enum SchemaFields{
	AS_ASSETS
}

function getLoaderForDataType(AS_ASSET_FIELD_DATA_TYPE: string) : string{
	var file = null;
	switch (AS_ASSET_FIELD_DATA_TYPE) {
		case DataType.AS_STRING:
			file = "./app/loaders/default/asDefaultStringLoader.js";
			break;
		case DataType.AS_INT:
			file = "./app/loaders/default/asDefaultIntLoader.js";
			break;
		case DataType.AS_FLOAT:
			file = "./app/loaders/default/asDefaultFloatLoader.js";
			break;
		case DataType.AS_SELECT:
			file = "./app/loaders/default/asDefaultSelectLoader.js";
			break;
		case DataType.AS_BOOLEAN:
			file = "./app/loaders/default/asDefaultBooleanLoader.js";
			break;
		default:
			return null;
	}
	return fs.readFileSync(file, 'utf8');
}

export class Loader{
	public name: string;
	public body: string;

	constructor(name:string, generateBody:boolean){
		this.name = name;
		if(generateBody){
			this.body =
	
`exports.create = function create(value) {
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
	public loader: string;
	public dataType: string;
	public default: any;

	constructor(def:any){
		var missingProps = utils.assertHasProperties(def, [AsFields.AS_ASSET_FIELD_NAME, AsFields.AS_ASSET_FIELD_DATA_TYPE]);
		if (missingProps.length > 0) {
			missingProps.forEach(prop => {
				utils.logError("Missing required property " + prop + " for AssetField");

			});
		}else{
			this.dataType = def[AsFields.AS_ASSET_FIELD_DATA_TYPE];
			this.name = def[AsFields.AS_ASSET_FIELD_NAME];
			if(def.hasOwnProperty("default")){
				this.default = def.default;
			}else{
				switch (def[AsFields.AS_ASSET_FIELD_DATA_TYPE]) {
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
			if(!def.hasOwnProperty(AsFields.AS_ASSET_FIELD_LOADER)){
				this.loader = requireFromString(getLoaderForDataType(def[AsFields.AS_ASSET_FIELD_DATA_TYPE]));
				if (this.loader === null) {
					utils.logError("No loader was provided for AssetType " + this.name + " and no default " +
						"loader was found for data type " + def[AsFields.AS_ASSET_FIELD_DATA_TYPE]);
					return;
				}
			}else{
				var projectService = globalAppInjector.get(ProjectService);
				this.loader = requireFromString(projectService.currentProject.loaders[def[AsFields.AS_ASSET_FIELD_LOADER]].body);
			}
		}
	}
}

export class AssetTypeDefinition{
	
	public name: string;
	public type: string;
	public fields: AssetFieldDefinition[] = [];

	constructor(def: any){
		var missingProps = utils.assertHasProperties(def, [AsFields.AS_ASSET_TYPE_NAME, AsFields.AS_ASSET_TYPE_TYPE, AsFields.AS_ASSET_TYPE_FIELDS]);
		if (missingProps.length > 0) {
			missingProps.forEach(prop => {
				utils.logError("Missing required property " + prop + " for AssetType");
			})
		} else {
			this.name = def[AsFields.AS_ASSET_TYPE_NAME];
			this.type = def[AsFields.AS_ASSET_TYPE_TYPE];
			def[AsFields.AS_ASSET_TYPE_FIELDS].forEach(fieldDef => {
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
		this._loader = def.loader;
		this.setValue(value);
		this.editing = true;
	}

	public toggleEditMode(){
		this.editing = !this.editing;
	}

	public refresh(){
		this.setValue(this.value);
	}

	private setValue(value){
		if (this.definition.dataType == DataType.AS_FILE) {
			let projectService = globalAppInjector.get(ProjectService);
			let absValue = projectService.resolveAbsoluteAssetFilePath(value);
			this.create = this._loader.create(absValue);
		}else{
			this.create	= this._loader.create(this.value);
		}
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