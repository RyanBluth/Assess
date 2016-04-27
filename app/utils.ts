
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
	console.error(message);
}
