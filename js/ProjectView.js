'use strict';

//представление уровня ПРОЕКТ
export class ProjectView {
	constructor(model) {
		this.myModel = model;

		this.toggleRunButtonHandler = this.toggleRunButton.bind(this);

		//подписываемся на изменения
		this.myModel.changes
			.sub('changeOnload', this.updatePage.bind(this));
		this.myModel.changes
			.sub('changeAutoUpdate', this.toggleRunButtonHandler);
		this.myModel.changes
			.sub('changeContentHeight', this.updateContentHeight.bind(this));
		this.myModel.changes
			.sub('contentSaved', this.showSaveMessage.bind(this));

	}

	updatePage(data) {
		//показываем кнопки и чекбокс
		$('.header__auto-update-label')
			.css('display', 'inline-block');
		$('#RUN-BUTTON')
			.css('display', 'inline-block');
		$('#SAVE-BUTTON')
			.css('display', 'inline-block');
		$('#LOGOUT-BUTTON')
			.css('display', 'inline-block');
		$('#CREATE-BUTTON')
			.css('display', 'inline-block');

		//показываем окна ввода и вывода
		$('.main__user-container')
			.css('display', 'block');
		$('.main__ouput-window')
			.css('display', 'block');

		$('.header__dashboard-link')
			.css('display', 'inline-block');

		$('.main__projects-list')
			.css('display', 'none');

		//показываем имя пользователя и имя проекта
		$('.header__title')
			.css('display', 'inline-block');
		$('.header__title__username, .header__title__projectname')
			.css('display', 'inline-block');
		$('.header__title__username')
			.text(`${this.myModel.user} / `);

		//устанавливаем чекбокс исходя из настроек и отображаем положение
		$('#AUTO-UPDATE')
			.prop('checked', data.autoUpdate);
		this.toggleRunButton(data.autoUpdate);

		//стилизуем элементы
		$('#LOGOUT-BUTTON, #CREATE-BUTTON, #SAVE-BUTTON, #RUN-BUTTON')
			.button();

		$('.header__dashboard-link')
			.button();

		$('.main__window-title')
			.click(function() {
				$(this).next().slideToggle();
			});

	}

	showSaveMessage() {
		//показываем на 3сек сообщение о сохранении
		$('.save, .layout__save__message')
			.css('display', 'block')
			.fadeOut(3000);
	}

	toggleRunButton(autoUpdate) {
		if (autoUpdate) {
			$('#RUN-BUTTON').hide(0);
			$('.header__auto-update-label')
				.css('background-color', '#2783b0');
			$('.header__auto-update-switcher')
				.css('left', '35px');
		} else {
			$('#RUN-BUTTON').show(0);
			$('.header__auto-update-label')
				.css('background-color', '#36383f');
			$('.header__auto-update-switcher')
				.css('left', '5px');
		}
	}

	unsubscribe() {
		//отписываемся от изменений модели
		this.myModel.changes
			.remove('changeAutoUpdate', this.toggleRunButtonHandler);
	}

	updateContentHeight(height) {
		$('.main').height(height);
	}

}