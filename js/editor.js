function createEditor(id, theme, mode) {
        let editor = ace.edit(id);
        editor.setTheme(theme);
        editor.session.setMode(mode);
		editor.session.setUseWrapMode(true);
				
}
window.addEventListener('DOMContentLoaded', editor);

function editor(e) {
    createEditor('HTML', "ace/theme/chrome", "ace/mode/html");
    createEditor('CSS', "ace/theme/chrome", "ace/mode/css");
    createEditor('JS', "ace/theme/chrome", "ace/mode/javascript");
}
