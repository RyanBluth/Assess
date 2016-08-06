exports.create = function create(value){
	return{
		template: function(){
			return '<input type="text" style="width:100%" value="' + value + '"/>'
		},
		setup: function(elem, updateValueFunc){
			elem.onchange = function(newVal){
				updateValueFunc(newVal.target.value);
			};
		}
	}
}