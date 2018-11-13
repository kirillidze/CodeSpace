'use strict';

//представление окон ввода данных уровня ПРОЕКТ (левая часть)
export class UserWinView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes.sub('changeOnload', this.updateWin.bind(this));
	}

	updateWin(data) {

		//показываем кнопки и чекбокс
		$('#AUTO-UPDATE')
			.css('display', 'inline-block');
		$('.header__auto-update-label')
			.css('display', 'inline-block');
		$('#RUN-BUTTON')
			.css('display', 'inline-block');
		$('#SAVE-BUTTON')
			.css('display', 'inline-block');

		//показываем окна ввода и вывода
		$('.main__user-container')
			.css('display', 'block');
		$('.main__ouput-window')
			.css('display', 'block');

		$('.header__dashboard-link')
			.css('display', 'inline-block');

		$('.header__projects-list')
			.css('display', 'none');



		//отрисовываем полученные с сервера данные		
		ace.edit("HTML").setValue(data.html);
		ace.edit("CSS").setValue(data.css);
		ace.edit("JS").setValue(data.js);
		$('#AUTO-UPDATE').prop('checked', data.autoUpdate);

		//показываем или прячем кнопку автообновления
		if (data.autoUpdate) {
			$('#RUN-BUTTON').hide(0);
		} else {
			$('#RUN-BUTTON').show(0);
		}
	}
}