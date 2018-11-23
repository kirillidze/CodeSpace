'use strict';

//представление уровня DASHBOARD
export class DashboardView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes
			.sub('changeListOnload', this.updateList.bind(this));
		this.myModel.changes
			.sub('changeContentHeight', this.updateContentHeight.bind(this));
		this.myModel.changes
			.sub('changeProjectList', this.showMessage.bind(this));
		this.myModel.changes
			.sub('changeProjectList', this.deleteProjectFromList.bind(this));
		this.myModel.changes
			.sub('changePageWidth', this.showButtonContainer.bind(this));
		this.myModel.changes
			.sub('changeButtonContainer', this.toggleButtonContainer.bind(this));
	}

	updateList(data) {
		//скрываем кнопки и чекбокс
		$('#AUTO-UPDATE')
			.css('display', 'none');
		$('.header__auto-update-label')
			.css('display', 'none');
		$('#RUN-BUTTON')
			.css('display', 'none');
		$('#SAVE-BUTTON')
			.css('display', 'none');
		$('#LOGIN-BUTTON')
			.css('display', 'none');
		$('#SIGNUP-BUTTON')
			.css('display', 'none');

		//скрываем промо-контент
		$('.main__promo-container')
			.css('display', 'none');

		//скрываем окна ввода и вывода
		$('.main__user-container')
			.css('display', 'none');
		$('.main__ouput-window')
			.css('display', 'none');

		$('.header__dashboard-link')
			.css('display', 'none');

		//показываем кнопки
		$('#CREATE-BUTTON')
			.css('display', 'inline-block');
		$('#LOGOUT-BUTTON')
			.css('display', 'inline-block');

		//показываем блок списка проектов и очищаем его
		$('.main__projects-list').html('');
		$('.main__projects-list')
			.css('display', 'block');

		//стилизуем кнопки
		$('#LOGOUT-BUTTON, #CREATE-BUTTON').button();

		//создаём ссылки для перехода к разным страницам
		for (let key in data) {
			//оборачиваем ссылки в div-ы
			let divWrapper = $('<div>');
			divWrapper.addClass('main__projects-list__wrapper');
			//кнопки для удаления
			$('<i>')
				.addClass('far fa-trash-alt main__projects-list__delete')
				.attr('data-hash', key)
				.appendTo(divWrapper);
			//ссылки на проекты
			$('<a>', {
				type: 'button',
				class: 'link',
				href: '#' + key,
				onclick: '(e) => {e.preventDefault();}',
				text: data[key].title
			}).appendTo(divWrapper);
			divWrapper.appendTo($('.main__projects-list'));
		}

		//показываем имя пользователя, скрываем имя проекта
		$('.header__title__username')
			.text(this.myModel.user);
		$('.header__title, .header__title__username')
			.css('display', 'inline-block');
		$('.header__title__projectname')
			.css('display', 'none');
	}

	updateContentHeight(height) {
		$('.main').height(height);
	}

	showMessage() {
		// показываем сообщение об успешности действий
		$('.save, .delete__message, .layout__save__message')
			.css('display', 'block')
			.fadeOut(3000, 'easeInQuart');
	}
	deleteProjectFromList(projectName) {
		//после удаления проекта находим div-обертку с удаленным проектом и удаляем его
		$(`[data-hash = ${projectName}]`)
			.parent()
			.remove();
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

