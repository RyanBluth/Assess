
import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';
import {NgFor, NgIf, NgModel, NgClass} from 'angular2/common';

import {PopupComponent, PopupOption} from './popup.component'
import {ObjectRendererComponent} from './objectRenderer.component'
import {AdjustingInputDirective} from './../directive/adjustingInput.directive'
import {GlobalEventService, GlobalEvent} from './../service/globalEvent.service'
import {AssetService} from './../service/asset.service'
import * as Utils from './../utils'
import {AsFields} from './../assetType'

declare var jQuery;

@Component({
	selector: 'assess-schema',
	directives: [ObjectRendererComponent, NgFor, NgIf],
	templateUrl: './app/templates/assess-schema.html'
})
export class SchemaComponent {

	private _assetService: AssetService;
	private _globalEventService: GlobalEventService;
	private _originalSchema: {} = null// Copy of the original schema so we can watch for changes

	@Input() schemaObject:{};

	constructor(@Inject(AssetService) _assetService:AssetService, 
		@Inject(GlobalEventService) _globalEventService: GlobalEventService) 
	{
		this._assetService = _assetService;
		this._globalEventService = _globalEventService;
	}

	public ngOnInit(){
		if (this._originalSchema === null) {
			this._originalSchema = jQuery.extend(true, {}, this.schemaObject);
		}
	}

	public ngDoCheck() {
		if(!Utils.looseEquals(this.schemaObject, this._originalSchema)){
			// Update schema copy
			this._originalSchema = jQuery.extend(true, {}, this.schemaObject);
			// Brodacast that the schema has changed
			this._globalEventService.brodcast(GlobalEvent.SCHEMA_CHANGE);
		}
	}

	public saveSchema(){
		this._assetService.writeProjectFile();
		this._assetService.loadLastProject();
	}
}