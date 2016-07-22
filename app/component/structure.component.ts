import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';

import {NgFor, NgIf, NgModel, NgClass} from 'angular2/common';

import {ObjectRendererComponent} from './objectRenderer.component'

@Component({
	selector: 'assess-structure',
	directives: [ObjectRendererComponent, NgFor, NgIf],
	templateUrl: './app/templates/assess-structure.html'
})
export class StructureComponent {

	@Input() structure: {};

	constructor() { }
}