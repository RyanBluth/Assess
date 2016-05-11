import {bootstrap} from 'angular2/platform/browser';
import {ElementRef, NgZone, provide, ComponentRef, Component, EventEmitter, Injector, ApplicationRef, Provider, Inject, Input, Output, Optional, Injectable, AfterViewChecked} from 'angular2/core';
import * as Components from './app.component';
import {ProjectService} from './project'

export var globalAppInjector: Injector = null;

bootstrap(Components.AppComponent, [Components.AssetService, ProjectService])
.then((appRef: ComponentRef) => {
	globalAppInjector = appRef.injector;
});


