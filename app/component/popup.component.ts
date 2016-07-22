
import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';
import {NgFor, NgIf, NgModel, NgClass} from 'angular2/common';

import {GlobalEventService, GlobalEvent} from './../service/globalEvent.service'

export class PopupOption{

	public onClick: ()=>void;
	public label: string;

	constructor(label: string, onClick:()=>void){
		this.label = label;
		this.onClick = onClick;
	}
}

@Component({
	selector: 'assess-popup',
	templateUrl: './app/templates/assess-popup.html',
	directives: [NgFor, NgIf]
})
export class PopupComponent {

	@Input() options: PopupOption[];
	@Input() icon: string;

	public hidden = true;

	constructor( @Inject(GlobalEventService) globalEventService: GlobalEventService) {
		globalEventService.subscribe(GlobalEvent.GLOBAL_CLICK, (event) => {
			if (!this.hidden) {
				this.toggleHidden();
			}
		});
	}

	public clickOption(option){
		option.onClick(); 
		this.toggleHidden(); 
	}

	public toggleHidden(){
		this.hidden = !this.hidden;
	}
}
