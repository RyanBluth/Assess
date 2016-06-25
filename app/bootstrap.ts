import {bootstrap} from 'angular2/platform/browser';
import {ElementRef, NgZone, provide, ComponentRef, Component, EventEmitter, Injector, ApplicationRef, Provider, Inject, Input, Output, Optional, Injectable, AfterViewChecked} from 'angular2/core';
import * as Components from './app.component';
import {ProjectService} from './project';
import * as Utils from './utils';

export var globalAppInjector: Injector = null;

bootstrap(Components.AppComponent, [Components.GlobalEventService, Components.AssetService, ProjectService])
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


