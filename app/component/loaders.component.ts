import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from '@angular/core';

import {NgFor, NgIf, NgModel, NgClass} from '@angular/common';

import {CodeEditorComponent} from './codeEditor.component';

import {ProjectService} from './../service/project.service'
import {GlobalEventService, GlobalEvent} from './../service/globalEvent.service'
import {Project} from './../Project'

import * as Assets from './../assetType'

@Component({
	selector: 'assess-loaders',
	templateUrl: './app/templates/assess-loaders.html',
	directives: [NgFor, NgIf, CodeEditorComponent, NgClass]
})
export class LoadersComponent implements OnInit{
	@Input() loaders: {} = {};
	@ViewChild(CodeEditorComponent) editor: CodeEditorComponent;

	private _currentLoader: string;
	private _projectService: ProjectService;
	private _renaming: boolean;
	private _sortedLoaders: string[] = [];

	constructor( @Inject(ProjectService) _projectService: ProjectService, @Inject(GlobalEventService) _globalEventService: GlobalEventService) {	
		this._projectService = _projectService;
	}

	public ngOnInit(){
		Object.keys(this.loaders).forEach((loader) => {
			this._sortedLoaders.push(loader);
		});
	}

	public updateLoaderName(originalKey, event){
		var tempBody = this.loaders[originalKey];
		delete this.loaders[originalKey];
		this._sortedLoaders[this._sortedLoaders.indexOf(originalKey)] = event.target.value;
		this.loaders[event.target.value] = tempBody;
	}

	public newLoader(){
		var key = 'Loader' + Object.keys(this.loaders).length;
		this.loaders[key] = (new Assets.Loader(key, true));
		this._sortedLoaders.push(key);
	}

	public openLoader(name:string){
		this._currentLoader = name;
		this.editor.setValue(this.loaders[name].body);
	}

	public updateLoader(value){
		if(this._currentLoader !== undefined){
			this.loaders[this._currentLoader].body = value; 
		}
	}

	public getLoaderNames():string[]{
		return Object.keys(this.loaders);
	}

	public saveLoader(){
		this._projectService.writeProjectFile();
	}

	public rename(){
		this._renaming = true;
	}
}