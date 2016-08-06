System.register(['@angular/core', '@angular/common'], function(exports_1, context_1) {
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
    var core_1, common_1;
    var CodeEditorComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            CodeEditorComponent = (function () {
                function CodeEditorComponent(_elem) {
                    this.target = "";
                    this.codeChange = new core_1.EventEmitter();
                    this._elem = _elem.nativeElement;
                }
                CodeEditorComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var textarea = jQuery(this._elem).find("textarea")[0];
                    this._codeMirror = CodeMirror.fromTextArea(textarea, {
                        mode: { name: "javascript", json: true },
                        theme: 'base16-dark'
                    });
                    this._codeMirror.on("change", function (cm, change) {
                        _this.codeChange.emit(cm.getValue());
                    });
                };
                CodeEditorComponent.prototype.setValue = function (value) {
                    this._codeMirror.setValue(value);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], CodeEditorComponent.prototype, "target", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], CodeEditorComponent.prototype, "codeChange", void 0);
                CodeEditorComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-code-editor',
                        templateUrl: './app/templates/assess-code-editor.html',
                        directives: [common_1.NgFor, common_1.NgIf, common_1.NgModel]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], CodeEditorComponent);
                return CodeEditorComponent;
            }());
            exports_1("CodeEditorComponent", CodeEditorComponent);
        }
    }
});
//# sourceMappingURL=codeEditor.component.js.map