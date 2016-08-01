declare function require(moduleName: string): any;
const fs = require('fs'); 

import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, 
	AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';

import {NgFor, NgIf, NgModel, NgClass} from 'angular2/common';
import * as Assets from './../assetType';
import * as utils from "./../utils";
import {ProjectService} from './../service/project.service'
import {AssetService} from './../service/asset.service'
import {AssetWriteFormat} from './../project'

@Component({
	selector: '[asses-asset-field]',
	template: '<div class="asset-field" [innerHTML]="_innerHtml"></div>'
})
export class AssetFieldComponent implements AfterViewChecked, OnChanges {
	
	@Input() field: Assets.AssetField;

	private _elem: any;
	private _assetService: AssetService;
	private _zone: NgZone;
	private _projectService: ProjectService;
	private _innerHtml: string = "";

	constructor(_zone:NgZone, _elem: ElementRef, 
		@Inject(AssetService) _assetService: AssetService, 
		@Inject(ProjectService) _projectService) {
		
		this._elem = _elem.nativeElement;
		this._assetService = _assetService;
		this._zone = _zone;
		this._projectService = _projectService;
	}

	public ngOnChanges(){
		this._innerHtml = this.field.create.template();
	}

	public ngAfterViewChecked() {
		this.field.create.setup(this._elem, (value) => {this.updateValue(value)});
	}

	public updateValue(value:any){
		var isFileValue = false;
		try {
			fs.accessSync(value, fs.R_OK); // Check for file access
			isFileValue = true;
		} catch (ignored) {/*Fail silently*/ }
		this.field.value = value;
		if(isFileValue){
			this.field.value = this._projectService.resolveRelativeAssetFilePath(value);
		}
		this.field.refresh();
		this._assetService.writeAssets(AssetWriteFormat.JSON);
		this.ngOnChanges();
	}
}
