exports.load = function load(originalValue) {
	return "loaded" + originalValue;
};

exports.render = function render(loadedValue) {
    return "<h1>" + loadedValue + "</h1>";
};

exports.script = function script(origValue, loadedValue) {
};
