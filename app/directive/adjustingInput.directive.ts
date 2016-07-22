import {ElementRef, NgZone, provide, Component, EventEmitter, Injector, Directive,
	ApplicationRef, Provider, Inject, Input, Output, OnChanges, 
	Optional, Injectable, AfterViewChecked, AfterContentChecked, OnInit, SimpleChange, ViewChild} from 'angular2/core';

@Directive({
	selector: '[assess-adjusting-input]'
})
export class AdjustingInputDirective implements OnInit, OnChanges {
	
	@Input() ngModel: any;

	private _elem: any;
	private _dummySpan: any;
	private _fontSize: number;

	constructor(elem: ElementRef){
		this._elem = elem.nativeElement;
	}

	public ngOnInit() {
		this._dummySpan = document.createElement("span");
		var fontSize = window.getComputedStyle(this._elem, null).getPropertyValue('font-size');
		this._dummySpan.style.fontSize = fontSize;
		this._fontSize = parseFloat(fontSize);
		this._elem.parentElement.appendChild(this._dummySpan);
		this._dummySpan.innerHTML = this._elem.value;
		this.updateWidth();
	}

	public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
		if (this._dummySpan != undefined) {
			this._dummySpan.innerHTML = changes["ngModel"].currentValue;
			this.updateWidth();
		}
	}

	private updateWidth(){
		this._dummySpan.style.display = "inline-block"; 
		this._elem.style.width = this._dummySpan.offsetWidth + this._fontSize + "px";
		this._dummySpan.style.display = "none"; 
	}
}