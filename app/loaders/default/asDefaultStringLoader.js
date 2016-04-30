exports.preview = function preview(value){
	return{
		template: '<span>' + value + '</span>',	 
		run: function(elem){}
	}
}

exports.edit = function edit(value){
	return{
		template: '<input type="text" value="' + value + '"/>',
		run: function(elem, updateValueFunc){
			elem.onChange(function(){
				updateValueFunc(elem.value);
			});
		}
	}
}