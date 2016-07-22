
import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';

import * as Assets from './../assetType'

@Component({
	selector: '[assess-asset-header]',
	templateUrl: './app/templates/assess-asset-header.html'
})
export class AssetHeaderComponent {

	@Input() assetType: Assets.AssetTypeDefinition;

	constructor() { }
}
