exports.preview = function preview(value){
	return{
		template: '<span>' + value + '</span>',	 
		run: function(elem){}
	}
}

