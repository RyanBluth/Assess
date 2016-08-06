
import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {NgFor, NgIf, NgModel, NgClass} from '@angular/common';

import {PopupComponent, PopupOption} from './popup.component'
import {AdjustingInputDirective} from './../directive/adjustingInput.directive'
import {GlobalEventService} from './../service/globalEvent.service'
import * as Utils from './../utils'
import {AsFields} from './../assetType'

@Component({
	selector: 'assess-object-renderer',
	templateUrl: './app/templates/assess-object-renderer.html',
	directives: [NgFor, NgIf, NgModel, ObjectRendererComponent, PopupComponent, AdjustingInputDirective]
})
export class ObjectRendererComponent implements OnInit, AfterContentChecked {

	@Input() object: {}[];
	@Input() bracketIndex: number;
	@Input() isRootElement: boolean;

	public collapsed = false;

	private _zone: NgZone;
	private _sortedFields: any[] = [];
	private _closingBracket: boolean = false;
	private _globalEventService: GlobalEventService;
	private _bracketColors = [
		"#ff0000",
		"#00ff00",
		"#0000ff",
	];

	constructor( @Inject(GlobalEventService) _globalEventService: GlobalEventService, _zone: NgZone) {
		this._globalEventService = _globalEventService;
		this._zone = _zone;
	}

	public ngOnInit() {
		this._sortedFields = Object.keys(this.object);
	}

	public ngAfterContentChecked() {
		var keys = Object.keys(this.object);
		var diff = keys.length - this._sortedFields.length;
		if (diff > 0) {
			this._sortedFields.push(keys[keys.length - 1]);
		}
	}

	public objectProperties(): string[] {
		return this._sortedFields;
	}

	public isArray(val): boolean {
		return val instanceof Array && !(val instanceof String);
	}

	public isObject(val): boolean {
		return (val instanceof Object) && !(val instanceof Array) && !(val instanceof String);
	}

	public isInteger(val): boolean {
		return !isNaN(val);
	}

	public toggleCollapse(): void {
		this.collapsed = !this.collapsed;
	}

	public getColorForType(prop) {
		return typeof this.object[prop];
	}

	public updateKey(key, event) {
		if (event.target.value.length == 0) {
			event.srcElement.value = key;
			Utils.logError("Key cannot be a blank value");
			return;
		}
		if (!this.object.hasOwnProperty(event.target.value)) {
			var val = this.object[key];
			delete this.object[key];
			this.object[event.target.value] = val;
			this._sortedFields[this._sortedFields.indexOf(key)] = event.target.value;
		} else {
			Utils.logError("Can't update value. Property " + event.target.value + " already exists");
			event.srcElement.value = key;
		}

	}

	public addNewProperty(property): void {
		if (this.isArray(this.object[property])) {
			(<Array<any>>this.object[property]).push('');
		} else if (this.isObject(this.object[property])) {
			var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
			this.object[property][newKey] = "";
		} else {
			Utils.logError("Could not add new element");
		}
	}

	public addNewArray(property): void {
		if (this.isArray(this.object[property])) {
			(<Array<any>>this.object[property]).push(new Array());
		} else if (this.isObject(this.object[property])) {
			var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
			this.object[property][newKey] = new Array();
		} else {
			Utils.logError("Could not add new element");
		}

	}

	public addNewObject(property): void {
		if (this.isArray(this.object[property])) {
			(<Array<any>>this.object[property]).push(new Object());
		} else if (this.isObject(this.object[property])) {
			var newKey = "Property" + (Object.keys(this.object[property]).length + 1).toString();
			this.object[property][newKey] = new Object();
		} else {
			Utils.logError("Could not add new element");
		}
	}

	public deleteProperty(property): void {
		if (this.isArray(this.object)) {
			(<Array<any>>this.object).splice(property, 1);
			this._sortedFields = [];
			for (let i = 0; i < (<Array<any>>this.object).length; ++i) {
				this._sortedFields.push(i);
			}
		} else if (this.isObject(this.object)) {
			delete this.object[property];
			this._sortedFields.splice(this._sortedFields.indexOf(property), 1);
		} else {
			Utils.logError("Could not delete " + property);
		}
	}

	public getOptionsForProperty(property): PopupOption[] {
		var options = [];
		if (this.isArray(this.object[property])) {
			options.push(
				new PopupOption("New Element", () => { this.addNewProperty(property) }),
				new PopupOption("New Object", () => { this.addNewObject(property) }),
				new PopupOption("New Array", () => { this.addNewArray(property) }),
				new PopupOption("Delete", () => { this.deleteProperty(property) })
			);
		} else if (this.isObject(this.object[property])) {
			options.push(
				new PopupOption("New Property", () => { this.addNewProperty(property) }),
				new PopupOption("New Object", () => { this.addNewObject(property) }),
				new PopupOption("New Array", () => { this.addNewArray(property) }),
				new PopupOption("Delete", () => { this.deleteProperty(property) })
			);
		} else {
			options.push(
				new PopupOption("Delete", () => { this.deleteProperty(property) })
			);
		}

		if (property == AsFields.SCHEMA.AS_ASSETS) {
			options.push(new PopupOption("New Asset Type", () => {
				(<[{}]>this.object[AsFields.SCHEMA.AS_ASSETS]).push(
					{
						AS_ASSET_TYPE_NAME: "Display Name",
						AS_ASSET_TYPE_TYPE: "Asset Type",
						AS_ASSET_TYPE_FIELDS: []
					}
				);
			}))
		}

		if (property == AsFields.SCHEMA.AS_ASSET_TYPE_FIELDS) {
			options.push(new PopupOption("New Field", () => {
				(<[{}]>this.object[AsFields.SCHEMA.AS_ASSET_TYPE_FIELDS]).push(
					{
						AS_ASSET_FIELD_DATA_TYPE: "AS_STRING",
						AS_ASSET_FIELD_NAME: "Field Name"
					}
				);
			}))
		}

		return options;
	}

	public getCompletionsForProperty(property): PopupOption[] {
		var options: PopupOption[] = [];

		if(property == AsFields.SCHEMA.AS_ASSET_FIELD_DATA_TYPE){
			options.push(
				new PopupOption("AS_STRING", () => { this.object[property] = "AS_STRING" }),
				new PopupOption("AS_BOOLEAN", () => { this.object[property] = "AS_BOOLEAN" }),
				new PopupOption("AS_FLOAT", () => { this.object[property] = "AS_FLOAT" }),
				new PopupOption("AS_INT", () => { this.object[property] = "AS_INT" })
			);
		}

		return options;
	}

	public getOptionsForRoot(){
		var options = [];
		if (this.isArray(this.object)) {
			options.push(
				new PopupOption("New Element", () => { this.object.push("") }),
				new PopupOption("New Object", () => { this.object.push({}) }),
				new PopupOption("New Array", () => { this.object.push([]) })
			);
		} else if (this.isObject(this.object)) {
			var newKey = "Property" + (Object.keys(this.object).length + 1).toString();
			options.push(
				new PopupOption("New Property", () => { this.object[newKey] = "New Value" }),
				new PopupOption("New Object", () => { this.object[newKey] = {} }),
				new PopupOption("New Array", () => { this.object[newKey] = [] })
			);
		} 
		return options;
	}

	public getBracketColor(): string {
		if (this.bracketIndex >= this._bracketColors.length) {
			this.bracketIndex = 0;
		}
		var color = this._bracketColors[this.bracketIndex];
		if (this._closingBracket) {
			this.bracketIndex++;
		}
		this._closingBracket = !this._closingBracket;
		return color;
	}
}
