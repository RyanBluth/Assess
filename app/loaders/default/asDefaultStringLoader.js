exports.create = function create(value){
	return{
		template: '<input type="text" value="' + value + '"/>',
		setup: function(elem, updateValueFunc){
			elem.onchange = function(newVal){
				updateValueFunc(newVal.target.value);
			};
		}
	}
}