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

	updatePage() {
		//показываем кнопки и чекбокс
		$('#AUTO-UPDATE')
			.css('display', 'inline-block');
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

		//стилизуем элементы
		$('#LOGOUT-BUTTON, #CREATE-BUTTON, #SAVE-BUTTON, #RUN-BUTTON')
			.button();

		$('#AUTO-UPDATE')
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

	toggleRunButton() {
		if (this.myModel.autoUpdate) {
			$('#RUN-BUTTON').hide(0);
		} else {
			$('#RUN-BUTTON').show(0);
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