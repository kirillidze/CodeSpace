'use strict';

//представление уровня PROMO
export class PromoView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes.sub('changeOnload', this.update.bind(this));
	}

	update() {
		//скрываем кнопки и чекбокс
		$('#AUTO-UPDATE')
			.css('display', 'none');
		$('.header__auto-update-label')
			.css('display', 'none');
		$('#RUN-BUTTON')
			.css('display', 'none');
		$('#SAVE-BUTTON')
			.css('display', 'none');

		//скрываем окна ввода и вывода
		$('.main__user-container')
			.css('display', 'none');
		$('.main__ouput-window')
			.css('display', 'none');

		$('.header__dashboard-link')
			.css('display', 'none');

		$('.header__projects-list') //этот блок надо удалить из html
			.css('display', 'none');

		$('.header__projects-list').html(''); //этот блок надо удалить из html

		$('.main__projects-list')
			.css('display', 'none');

		$('#CREATE-BUTTON')
			.css('display', 'none');

		//показываем промо-контент и кнопки авторизации/регистрации
		$('.main__promo-container')
			.css('display', 'block');
		$('#LOGIN-BUTTON')
			.css('display', 'inline-block');
		$('#SIGNUP-BUTTON')
			.css('display', 'inline-block');

		$('.layout')
			.css('background-image', `url(${this.myModel.layoutLink})`);

	}
}