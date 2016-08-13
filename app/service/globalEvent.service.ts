
import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from '@angular/core';

import {AssetService} from "./Asset.service"

import {AppComponent} from './../component/app.component'

import {globalAppInjector} from './../bootstrap'

export enum GlobalEvent {
	GLOBAL_CLICK   = 0,
	SCHEMA_CHANGE  = 1,
	ERROR_MESSAGE  = 2,
	INFO_MESSAGE   = 3,
	PROJECT_LOADED = 4
}

@Injectable()
export class GlobalEventService {

	private _elemRef: any
	private _zone: NgZone;

	private _emitters = {
		"GLOBAL_CLICK"   : new EventEmitter(),
		"SCHEMA_CHANGE"  : new EventEmitter(),
		"ERROR_MESSAGE"  : new EventEmitter(),
		"INFO_MESSAGE"   : new EventEmitter(),
		"PROJECT_LOADED" : new EventEmitter()
	}

	constructor( @Inject(NgZone) _zone: NgZone) {
		this._zone = _zone;
	}

	public hookupAppElement(app: AppComponent) {
		this._elemRef = app.getElement();
		this._elemRef.onclick = (e) => {
			this._zone.run(() => {
				this._emitters[GlobalEvent[GlobalEvent.GLOBAL_CLICK]].emit(e);
			});
		}
	}

	public subscribe(event: GlobalEvent, func: (data: any) => void) {
		this._emitters[GlobalEvent[event]].subscribe(func);
	}

	public brodcast(event: GlobalEvent, data:any = null) {
		this._zone.run(() => {
			this._emitters[GlobalEvent[event]].emit(data);
		});
	}
}