exports.preview = function preview(value){
	return{
		template: '<img src='+ value +'/>',	 
		run: function(elem){

		}
	}
}

exports.edit = function edit(value, updateValueFunc){
	return{
		template: 'EDIT',
		run: function(elem){
		}
	}
}