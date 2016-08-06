System.register(['@angular/core', '@angular/common', './objectRenderer.component'], function(exports_1, context_1) {
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
    var core_1, common_1, objectRenderer_component_1;
    var StructureComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (objectRenderer_component_1_1) {
                objectRenderer_component_1 = objectRenderer_component_1_1;
            }],
        execute: function() {
            StructureComponent = (function () {
                function StructureComponent() {
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], StructureComponent.prototype, "structure", void 0);
                StructureComponent = __decorate([
                    core_1.Component({
                        selector: 'assess-structure',
                        directives: [objectRenderer_component_1.ObjectRendererComponent, common_1.NgFor, common_1.NgIf],
                        templateUrl: './app/templates/assess-structure.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], StructureComponent);
                return StructureComponent;
            }());
            exports_1("StructureComponent", StructureComponent);
        }
    }
});
//# sourceMappingURL=structure.component.js.map