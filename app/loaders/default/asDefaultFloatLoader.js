exports.create = function create(value){
	return{
		template: function(){
			return '<input type="text" value="' + value + '"/>'
		},
		setup: function(elem, updateValueFunc){
			elem.onchange = function(newVal){
				updateValueFunc(newVal.target.value);
			};
		}
	}
}