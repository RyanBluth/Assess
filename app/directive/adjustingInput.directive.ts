import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, HostListener, ViewChild} from '@angular/core';

@Directive({
	selector: '[assess-adjusting-input]'
})
export class AdjustingInputDirective implements OnInit {

	private _elem: any;
	private _dummySpan: any;
	private _fontSize: number;

	@Input() value:string;

	constructor(elem: ElementRef){
		this._elem = elem.nativeElement;
	}

	@HostListener('keydown', ['$event.target']) onKeydown(field) {
    	
    	if (this._dummySpan != undefined) {
			this._dummySpan.innerHTML = field.value;
    	}
    	this.updateWidth(this._fontSize);
  	}

	public ngOnInit() {
		this._elem.value = this.value;
		this._dummySpan = document.createElement("span");
		var fontSize = window.getComputedStyle(this._elem, null).getPropertyValue('font-size');
		this._dummySpan.style.fontSize = fontSize;
		this._fontSize = parseFloat(fontSize);
		this._elem.parentElement.appendChild(this._dummySpan);
		this._dummySpan.innerHTML = this.value;
		this.updateWidth(this._fontSize);
	}

	private updateWidth(padding:number){
		this._dummySpan.style.display = "inline-block"; 
		this._elem.style.width = this._dummySpan.offsetWidth + padding + "px";
		this._dummySpan.style.display = "none"; 
	}
}