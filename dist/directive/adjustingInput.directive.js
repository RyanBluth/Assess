System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var AdjustingInputDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AdjustingInputDirective = (function () {
                function AdjustingInputDirective(elem) {
                    this._elem = elem.nativeElement;
                }
                AdjustingInputDirective.prototype.onKeydown = function (field) {
                    if (this._dummySpan != undefined) {
                        this._dummySpan.innerHTML = field.value;
                    }
                    this.updateWidth(this._fontSize);
                };
                AdjustingInputDirective.prototype.ngOnInit = function () {
                    this._dummySpan = document.createElement("span");
                    var fontSize = window.getComputedStyle(this._elem, null).getPropertyValue('font-size');
                    this._dummySpan.style.fontSize = fontSize;
                    this._fontSize = parseFloat(fontSize);
                    this._elem.parentElement.appendChild(this._dummySpan);
                    this._dummySpan.innerHTML = this._elem.value;
                    this.updateWidth(this._fontSize);
                };
                AdjustingInputDirective.prototype.ngOnChanges = function (changes) {
                    if (this._dummySpan != undefined) {
                        this._dummySpan.innerHTML = changes["ngModel"].currentValue;
                        this.updateWidth(this._fontSize);
                    }
                };
                AdjustingInputDirective.prototype.updateWidth = function (padding) {
                    this._dummySpan.style.display = "inline-block";
                    this._elem.style.width = this._dummySpan.offsetWidth + padding + "px";
                    this._dummySpan.style.display = "none";
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], AdjustingInputDirective.prototype, "ngModel", void 0);
                __decorate([
                    core_1.HostListener('keydown', ['$event.target']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], AdjustingInputDirective.prototype, "onKeydown", null);
                AdjustingInputDirective = __decorate([
                    core_1.Directive({
                        selector: '[assess-adjusting-input]'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], AdjustingInputDirective);
                return AdjustingInputDirective;
            }());
            exports_1("AdjustingInputDirective", AdjustingInputDirective);
        }
    }
});
//# sourceMappingURL=adjustingInput.directive.js.map