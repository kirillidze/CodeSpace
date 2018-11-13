'use strict';

function createEditor(id, theme, mode) {
	let editor = ace.edit(id);
	editor.setTheme(theme);
	editor.session.setMode(mode);
	editor.session.setUseWrapMode(true);
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: true,
	});
}

window.addEventListener('DOMContentLoaded', editor);

function editor(e) {
	createEditor('HTML', "ace/theme/monokai", "ace/mode/html");
	createEditor('CSS', "ace/theme/monokai", "ace/mode/css");
	createEditor('JS', "ace/theme/monokai", "ace/mode/javascript");
}
