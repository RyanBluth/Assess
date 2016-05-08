exports.create = function create(value){
	return{
		template: '<input step="1" type="number" value="' + value + '"/>',
		setup: function(elem, updateValueFunc){
			elem.onchange = function(newVal){
				updateValueFunc(newVal.target.value);
			};
		}
	}
}