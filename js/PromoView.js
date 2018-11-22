'use strict';

//представление уровня PROMO
export class PromoView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes
			.sub('changeOnload', this.update.bind(this));
		this.myModel.changes
			.sub('changeContentHeight', this.updateContentHeight.bind(this));
		this.myModel.changes
			.sub('changeButtonContainer', this.toggleButtonContainer.bind(this));
		this.myModel.changes
			.sub('changePageWidth', this.showButtonContainer.bind(this));
		this.myModel.changes
			.sub('hideButtonContainer', this.toggleButtonContainer.bind(this));
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
		$('#LOGOUT-BUTTON')
			.css('display', 'none');

		//скрываем окна ввода и вывода
		$('.main__user-container')
			.css('display', 'none');
		$('.main__ouput-window')
			.css('display', 'none');

		$('.header__dashboard-link')
			.css('display', 'none');

		$('.main__projects-list')
			.css('display', 'none');

		$('.main__projects-list').html('');

		$('#CREATE-BUTTON')
			.css('display', 'none');

		//показываем промо-контент и кнопки авторизации/регистрации
		$('.main__promo-container')
			.css('display', 'block');
		$('#LOGIN-BUTTON')
			.css('display', 'inline-block');
		$('#SIGNUP-BUTTON')
			.css('display', 'inline-block');

		//стилизуем кнопки
		$('#LOGIN-BUTTON, #SIGNUP-BUTTON').button();

		$('.layout')
			.css('background-image', `url(${this.myModel.layoutLink})`);

		//скрываем имя пользователя и название проекта
		$('.header__title, .header__title__username, .header__title__projectname')
			.css('display', 'none');
	}

	updateContentHeight(height) {
		$('.main').height(height);
	}

	toggleButtonContainer() {
		//прячем или показываем кнопки и слой
		$('.header__button-container, .header__button-container-layout')
			.fadeToggle();
	}

	showButtonContainer() {
		$('.header__button-container, .header__button-container-layout')
			.removeAttr('style');
	}



}