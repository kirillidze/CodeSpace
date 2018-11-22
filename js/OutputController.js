'use strict';

//контроллер окна вывода данных уровня ПРОЕКТ (правая часть)
export class OutputController {
	constructor(model) {
		this.myModel = model;

		$('#AUTO-UPDATE').unbind('change');

		//следим за изменением статуса чекбокса автообновления
		$('#AUTO-UPDATE').change(this.autoUpdateChecked.bind(this));

	}

	_getData() {
		return {
			html: ace.edit("HTML").getValue(),
			css: ace.edit("CSS").getValue(),
			js: ace.edit("JS").getValue(),
			autoUpdate: $('#AUTO-UPDATE').prop('checked')
		};

	}

	autoUpdateChecked() {
		let data = this._getData();

		this.myModel.setAutoUpdate(data);
	}

}
