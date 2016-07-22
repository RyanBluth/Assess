import {bootstrap} from 'angular2/platform/browser';
import {ElementRef, NgZone, provide, ComponentRef, Component, EventEmitter, Injector, ApplicationRef, Provider, Inject, Input, Output, Optional, Injectable, AfterViewChecked} from 'angular2/core';
import {AppComponent} from './component/app.component';
import {ProjectService} from './service/project.service';
import {GlobalEventService} from './service/globalEvent.service'
import {AssetService} from './service/asset.service'
import * as Utils from './utils';

export var globalAppInjector: Injector = null;

bootstrap(AppComponent, [AssetService, ProjectService, GlobalEventService])
.then((appRef: ComponentRef) => {
	globalAppInjector = appRef.injector;
	appRef.instance.initialize();

	var log = console.log;
	var error = console.error;

	console.log = function(m){
		Utils.logInfo(m);
		log.apply(console, [m]);
	}

	console.error = function(m){
		Utils.logError(m);
		error.apply(console, [m]);
	}
});


