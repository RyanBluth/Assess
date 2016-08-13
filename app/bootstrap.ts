import {platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {ElementRef, NgZone, provide, ComponentRef, Component, EventEmitter, Injector, NgModuleRef, ApplicationRef, Provider, Inject, Input, Output, Optional, Injectable, AfterViewChecked} from '@angular/core';
import {AppModule} from './app.module';
import {ProjectService} from './service/project.service';
import {GlobalEventService} from './service/globalEvent.service'
import {AssetService} from './service/asset.service'
import * as Utils from './utils';

export var globalAppInjector: Injector = null;

platformBrowserDynamic().bootstrapModule(AppModule)
.then((appRef: NgModuleRef<AppModule>) => {
	globalAppInjector = appRef.injector;

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

