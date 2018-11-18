'use strict';

//контроллер окна вывода данных уровня ПРОЕКТ (правая часть)
export class OutputController {
	constructor(model) {
		this.myModel = model;

		$('#AUTO-UPDATE').unbind('change');

		//следим за изменением статуса чекбокса автообновления
		$('#AUTO-UPDATE').change(this.autoUpdateChecked.bind(this));

	}

	autoUpdateChecked() {
		this.myModel.setAutoUpdate($('#AUTO-UPDATE').prop('checked'));
	}

}