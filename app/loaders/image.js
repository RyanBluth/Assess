exports.create = function create(value){
	return{
		template: function(){
			var fs = require('fs');
			try{
				fs.accessSync(value);
				return '<img src="' + value + '"/>';
			}catch(e){
				return '<span>Select Image</span>';
			}	
		},
		setup: function(elem, updateValueFunc){
			elem.onclick = function(){
				var dialog = require('electron').remote.dialog;
				dialog.showOpenDialog(
					{ properties: ['openFile'], filters: [{ name: 'Image', extensions: ['png', 'jpg'] }] },
					(file) => {
						if (file != undefined) {
							updateValueFunc(file.toString());
						}
					}
				);
			};
		}
	}
}