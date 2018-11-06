'use strict';

//контроллер окна вывода данных уровня ПРОЕКТ (правая часть)
export class OutputController {
	constructor(model) {
		this.myModel = model;

		//следим за вводом данных в поля
		$('.main__user-container')
			.keypress(this.showOutputByTimer.bind(this));

		//следим за нажатием кнопки обновления
		$('#RUN-BUTTON')
			.click(this.showOutput.bind(this));

		//следим за нажатием кнопки сохранения
		$('#SAVE-BUTTON')
			.click(this.startSaving.bind(this));

		//следим за уходом со страницы
		window.onbeforeunload = this.startUnload.bind(this); //onbeforeunload
		//$(window).bind('beforeunload', this.startUnload.bind(this));

		//следим за изменением статуса чекбокса автообновления
		$('#AUTO-UPDATE').change(this.autoUpdateChecked.bind(this));

	}

	showOutput() {
		this.myModel.setContent();
	}

	showOutputByTimer(e) {
		this.myModel.setContentByTimer(e);
	}

	startSaving() {
		this.myModel.savingData();
	}

	startUnload(event) {
		this.myModel.pubUnloadMessage(event);
	}

	autoUpdateChecked() {
		this.myModel.setAutoUpdate($('#AUTO-UPDATE').prop('checked'));
	}

}