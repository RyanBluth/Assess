
import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {NgFor, NgIf, NgModel, NgClass} from '@angular/common';

import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';

import * as Assets from './../assetType'
import {AssetService} from './../service/asset.service'
import {AssetComponent} from './asset.component'
import {AssetHeaderComponent} from './assetHeader.component'

// Declare jquery - It's included in index.html
declare var jQuery: any;

@Component({
    selector: 'assess-asset-group',
    directives: [AssetComponent, AssetHeaderComponent, NgFor, NgIf, MD_BUTTON_DIRECTIVES],
    templateUrl: './app/templates/assess-asset-group.html'
})
export class AssetGroupComponent {

	@Input() assetGroup : {};
	@Input() assetGroupName: string;

	public assetService: AssetService;

	constructor( @Inject(AssetService) assetService: AssetService) {
		this.assetService = assetService; 
	}

	public ngAfterViewChecked() {
		jQuery("table").colResizable({ liveDrag: true });
	}
}
