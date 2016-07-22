import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';

import {NgFor, NgIf, NgModel, NgClass} from 'angular2/common';

import {GlobalEventService, GlobalEvent} from './../service/globalEvent.service'

@Component({
	selector: 'assess-console',
	templateUrl: './app/templates/assess-console.html'
})
export class ConsoleComponent{
	
	static ERROR: string = "error";
	static INFO : string = "info";

	private _globlaEventService: GlobalEventService;
	private _ref: any;
	private _zone: NgZone;

	private _lastResize:number = 0;

	public messages: {}[] = []; // Object format = { text:'some text', severity: 'ERROR, INFO'}

	constructor(
		@Inject(GlobalEventService) _globalEventService: GlobalEventService,
		_ref: ElementRef, 
		_zone: NgZone) 
	{
		this._ref = _ref.nativeElement;
		this._globlaEventService = _globalEventService;
		this._zone = _zone;
		
		this._globlaEventService.subscribe(GlobalEvent.ERROR_MESSAGE, (data) => { 
			this.messages.push({
				text: this.formatTimeStamp(data.time) + " - " + data.text,
				severity: ConsoleComponent.ERROR
			});
		});

		this._globlaEventService.subscribe(GlobalEvent.INFO_MESSAGE, (data) => {
			this.messages.push({
				text: this.formatTimeStamp(data.time) + " - " + data.text,
				severity: ConsoleComponent.INFO
			});
		});
	}

	public updateConsoleSize(event){
		this._zone.runOutsideAngular(()=>{
			var now = Date.now();
			if (now - this._lastResize > 33 && event.screenY > 0) {
				this._ref.children[0].style.height = screen.height - event.screenY - 40 + "px";
				this._lastResize = now;
			}
		});
	}

	private formatTimeStamp(date: Date): string{
		var m = date.getMinutes().toString();
		m = m.length == 1 ? "0" + m : m; 
		var s = date.getSeconds().toString();
		s = s.length == 1 ? "0" + s : s; 
		return date.getHours() + ":" + m + ":" + s;
	}
}