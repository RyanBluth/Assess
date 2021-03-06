exports.create = function create(value){
	return{
		template: function(){
			return '<input type="number" style="width:100%" step="0.1" value="' + value + '"/>'
		},
		setup: function(elem, updateValueFunc){
			elem.onchange = function(newVal){
				updateValueFunc(newVal.target.value);
			};
		}
	}
}