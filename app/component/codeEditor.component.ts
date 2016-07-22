import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';

import {NgFor, NgIf, NgModel, NgClass} from 'angular2/common';

// Declare jquery - It's included in index.html
declare var jQuery: any;
declare var CodeMirror: any; 

@Component({
	selector: 'assess-code-editor',
	templateUrl: './app/templates/assess-code-editor.html',
	directives: [NgFor, NgIf, NgModel]
})
export class CodeEditorComponent implements OnInit{

	@Input() target: string = "";
	@Output() codeChange = new EventEmitter();

	private _elem: any;
	private _codeMirror: any;

	constructor(_elem:ElementRef){
		this._elem = _elem.nativeElement;
	}

	ngOnInit(){
		var textarea = jQuery(this._elem).find("textarea")[0];
		this._codeMirror = CodeMirror.fromTextArea(textarea, {
			mode: { name: "javascript", json: true },
			theme: 'base16-dark'
		});

		this._codeMirror.on("change", (cm, change)=> {
			this.codeChange.emit(cm.getValue());
		});
	}

	public setValue(value: string){
		this._codeMirror.setValue(value);
	}

}