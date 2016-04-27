exports.load = function load(originalValue) {
	return "loaded" + originalValue;
};

exports.render = function render(loadedValue) {
    return "<h1>TEST</h1>";
};

exports.script = function script(origValue, loadedValue) {
};
