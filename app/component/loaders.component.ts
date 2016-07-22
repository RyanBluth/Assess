import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';

import {NgFor, NgIf, NgModel, NgClass} from 'angular2/common';

import {CodeEditorComponent} from './codeEditor.component';

import {ProjectService} from './../service/project.service'

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

	constructor( @Inject(ProjectService) _projectService: ProjectService) {
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
		this.editor.setValue(this.loaders[name].body);
		this._currentLoader = name;
	}

	public updateLoader(value){
		this.loaders[this._currentLoader].body = value; 
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