'use strict';

//контроллер окон ввода данных уровня ПРОЕКТ (левая часть)
export class UserWinController {
	constructor(model) {
		this.myModel = model;

		// предварительно отписываемся от событий
		$('#SAVE-BUTTON, #RUN-BUTTON')
			.unbind('click');
		$('.main__user-container').unbind('keypress');

		//следим за вводом данных в поля
		$('.main__user-container')
			.keypress(this.showOutputByTimer.bind(this));

		//следим за нажатием кнопки обновления
		$('#RUN-BUTTON')
			.click(this.showOutput.bind(this));

		//следим за нажатием кнопки сохранения
		$('#SAVE-BUTTON')
			.click(this.startSaving.bind(this));

	}

	startSaving() {
		this.myModel.savingData();
	}

	showOutput() {
		this.myModel.setContent();
	}

	showOutputByTimer(e) {
		this.myModel.setContentByTimer(e);
	}


}