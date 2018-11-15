'use strict';

//представление уровня DASHBOARD
export class DashboardView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes.sub('changeListOnload', this.updateList.bind(this));
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

		//создаём ссылки для перехода к разным страницам
		for (let key in data) {
			$('<a>', {
				type: 'button',
				class: 'link',
				href: '#' + key,
				onclick: '(e) => {e.preventDefault();}',
				text: key
			}).appendTo($('.main__projects-list'));
			$('<br>').appendTo($('.main__projects-list'));
		}
	}
}
