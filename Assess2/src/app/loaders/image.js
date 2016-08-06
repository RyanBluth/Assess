exports.create = function create(value){
	return{
		template: function(){

			var style = `
				<style>
					.img-asset{
						max-height:150px;
						max-with: 500px;
					}
				</style>
			`;

			var fs = require('fs');
			try{
				fs.accessSync(value);
				return style + '<img class="img-asset" src="' + value + '"/>';
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