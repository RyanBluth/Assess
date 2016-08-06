exports.create = function create(value){
	return{
		template: function(){

			return '<input type="number" style="width:100%" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" step="1" value="' + value + '"/>'
		},
		setup: function(elem, updateValueFunc){
			elem.onchange = function(newVal){
				updateValueFunc(newVal.target.value);
			};
		}
	}
}