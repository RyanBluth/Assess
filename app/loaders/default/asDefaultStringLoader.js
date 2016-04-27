exports.load = function load(originalValue) {
	return "loaded" + originalValue;
};

exports.render = function render(loadedValue) {
    return "<input type='text' value='" + loadedValue + "'/>";
};

exports.script = function script(origValue, loadedValue) {	
};
