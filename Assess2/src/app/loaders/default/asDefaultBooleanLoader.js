exports.create = function create(value){
	return{
		template: function(){
			if(value == true){
				return '<input type="checkbox" checked/>'
			}else{
				return '<input type="checkbox"/>'
			}
		},
		setup: function(elem, updateValueFunc){
			elem.onchange = function(newVal){
				if(newVal.target.value == "on"){
					updateValueFunc(true);
				}else{
					updateValueFunc(false);
				}
			};
		}
	}
}