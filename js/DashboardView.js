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

		//скрываем окна ввода и вывода
		$('.main__user-container')
			.css('display', 'none');
		$('.main__ouput-window')
			.css('display', 'none');

		$('.header__dashboard-link')
			.css('display', 'none');

		$('.header__projects-list')
			.css('display', 'block');

		$('.header__projects-list').html('');

		//создаём кнопки для перехода к разным страницам
		for (let key in data) {
			$('<a>', {
				type: 'button',
				class: 'link',
				href: '#' + key,
				onclick: '(e) => {e.preventDefault();}',
				text: key
			}).appendTo($('.header__projects-list'));
			$('<br>').appendTo($('.header__projects-list'));
		}
	}
}