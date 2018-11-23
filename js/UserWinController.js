'use strict';

//контроллер окон ввода данных уровня ПРОЕКТ (левая часть)
export class UserWinController {
	constructor(model) {
		this.myModel = model;

		// предварительно отписываемся от событий
		$('#SAVE-BUTTON, #RUN-BUTTON')
			.unbind('click');
		$('.main__user-container').unbind('keyup');
		$('.header__title__projectname').unbind();

		//следим за вводом данных в поля
		$('.main__user-container')
			.keyup(this.startSetContentByTimer.bind(this));

		//следим за нажатием кнопки обновления
		$('#RUN-BUTTON')
			.click(this.startSetContent.bind(this));

		//следим за нажатием кнопки сохранения
		$('#SAVE-BUTTON')
			.click(this.startSaving.bind(this));

		//следим за двойным кликом по имени проекта
		$('.header__title__projectname')
			.dblclick(this.pubDblclickOnProjectName.bind(this));

		//следим за уходом с имени проекта (редактирование закончено)		
		$('.header__title__input')
			.blur(this.pubBlurProjectName.bind(this));

		//следим за нажатием клавиш на имени проекта (Escape и Enter будут значить, что редактирование закончено)		
		$('.header__title__input')
			.keydown(this.pubKeydownInProjectName.bind(this));

	}

	startSaving() {
		//записываем из окон пользователя данные в хэш и передаём методу модели
		let data = this._getData();

		this.myModel.savingData(data);
	}

	_getData() {
		return {
			html: ace.edit("HTML").getValue(),
			css: ace.edit("CSS").getValue(),
			js: ace.edit("JS").getValue(),
			title: $('.header__title__projectname').text()
		};
	}

	startSetContent() {
		//записываем из окон пользователя данные в хэш и передаём методу модели
		let data = this._getData();

		this.myModel.setContent(data);
	}

	startSetContentByTimer(e) {
		//записываем из окон пользователя данные в хэш и передаём методу модели
		let data = this._getData();

		this.myModel.setContentByTimer(e, data);
	}

	pubDblclickOnProjectName() {
		this.myModel.changes
			.pub('changeByDblclick', 'changesWasPublished');
	}

	pubBlurProjectName() {
		this.myModel.changes
			.pub('changeByBlur', 'changesWasPublished');
	}

	pubKeydownInProjectName(e) {
		this.myModel.changes
			.pub('changeByKeydown', e);
	}

}
