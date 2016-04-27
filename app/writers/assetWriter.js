function write(obj){
	var out = {};
	if(obj.type == "IMAGE"){
		for((key, val) in obj.properties){
			out[key] = val; 
		}
	}
	return JSON.stringify(out);
}