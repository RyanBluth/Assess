exports.preview = function preview(value){
	return{
		template: '<span>' + value + '</span>',	 
		run: function(elem){}
	}
}

exports.edit = function edit(value, updateValueFunc){
	return{
		template: '',
		run: function(elem){
		}
	}
}