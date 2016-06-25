import {globalAppInjector} from "./bootstrap"
import {GlobalEventService, GlobalEvent} from "./app.component"

declare function require(moduleName: string): any;

export function assertHasProperties(obj: Object, fields: string[]): string[] {
	var missingProps: string[] = [];
	fields.forEach(prop => {
		if (!obj.hasOwnProperty(prop)) {
			missingProps.push(prop);
		}
	});
	return missingProps;
}

export function logError(message: any): void {
	var eventService: GlobalEventService = globalAppInjector.get(GlobalEventService);
	eventService.brodcast(GlobalEvent.ERROR_MESSAGE, {text: message, time: new Date()});
}

export function logInfo(message: any): void {
	var eventService: GlobalEventService = globalAppInjector.get(GlobalEventService);
	eventService.brodcast(GlobalEvent.INFO_MESSAGE, { text: message, time: new Date() });
}

export function looseEquals(a, b){
	var aArr = Array.isArray(a); 
	var bArr = Array.isArray(b);

	if(aArr != bArr){
		return false;
	}

	var aObj = a instanceof Object;
	var bObj = b instanceof Object;

	if (aObj != bObj) {
		return false;
	}

	if(aArr){
		if (a.length != b.length){
			return false;
		}
		for (let i = 0; i < a.length; ++i){
			if (!looseEquals(a[i], b[i])){
				return false;
			}
		}
		return true;
	}else if(aObj){
		for(let p in a){
			if (!b.hasOwnProperty(p) || !looseEquals(a[p], b[p])) {
				return false;
			}
		}
		return true;
	}else{
		return a == b;
	}
}
