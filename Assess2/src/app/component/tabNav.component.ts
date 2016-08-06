import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from '@angular/core';

import {NgFor, NgIf, NgModel, NgClass} from '@angular/common';

@Component({
	selector: 'assess-tab-nav',
	templateUrl: './app/templates/assess-tab-nav.html',
	directives: [NgFor]
})
export class TabNavComponent{
	
	@Input() tabs: {}[];

	constructor(){}

	public ngOnInit(){
		if(this.tabs.length > 0){
			this.select(this.tabs[0]);
		}
	}

	public select(tab: any){
		this.tabs.forEach((tab)=>{
			tab['isSelected'] = false;			
		});
		tab['isSelected'] = true;
		tab.click();
	}
}
