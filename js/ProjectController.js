'use strict';

//контроллер уровня ПРОЕКТ
export class ProjectController {
	constructor(model) {
		this.myModel = model;

		// предварительно отписываемся от событий
		$('.header__bars-menu, .header__button-container-layout, .header__dashboard-link, #CREATE-BUTTON, #LOGOUT-BUTTON')
			.unbind('click');

		//следим за нажатием кнопки выхода
		$('#LOGOUT-BUTTON')
			.click(
				this.startLogOut.bind(this)
			);

		//следим за нажатием кнопки создания нового проекта
		$('#CREATE-BUTTON')
			.click(this.startCreateNewProject.bind(this));

		$(window)
			.resize(
				this.startResizeContent.bind(this)
			);

		//следим за нажатием по бургеру или по слою бургера
		$('.header__bars-menu, .header__button-container-layout')
			.click(
				this.startToggleButtonContainer
				.bind(this)
			);

		//следим за нажатием по ссыллке dashboard
		$('.header__dashboard-link')
			.click(
				this.startChangeButtonContainer.bind(this)
			);

		//следим за уходом со страницы
		window.onbeforeunload = this.startUnload.bind(this);

		this.startLoading();
		this.startResizeContent();
	}

	startLoading() {
		//обращаемся к модели, чтобы она начала загрузку данных
		this.myModel.loadServerData();
	}

	startLogOut() {
		this.myModel.logOut();
	}

	startCreateNewProject() {
		//обращаемся к модели, чтобы она начала создание проекта
		this.myModel.createNewProject();
	}

	startUnload(event) {
		this.myModel.pubUnloadMessage(event);
	}

	startResizeContent() {

		let heights = {
				window: $(window).outerHeight(true),
				header: $('.header').outerHeight(true),
				footer: $('.footer').outerHeight(true)
			},
			width = $(window).outerWidth();

		this.myModel.resizeContent(heights, width);

	}

	startToggleButtonContainer() {
		this.myModel.changes
			.pub('changeButtonContainer', 'changesWasPublished');
	}

	startChangeButtonContainer() {
		let width = $(window).outerWidth();
		this.myModel.changeButtonContainer(width);
	}


}