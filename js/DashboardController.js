'use strict';

//контроллер уровня DASHBOARD
export class DashboardController {
	constructor(model) {
		this.myModel = model;

		$('#CREATE-BUTTON, .main__projects-list').unbind('click');
		
		$(window)
			.resize(
				this.startResizeContent.bind(this)
			);

		//следим за нажатием кнопки выхода
		$('#LOGOUT-BUTTON')
			.click(
				this.startLogOut.bind(this)
			);

		//следим за нажатием кнопки создания нового проекта
		$('#CREATE-BUTTON')
			.click(
				this.startCreateNewProject.bind(this)
			);

		this.startLoading();
		this.startResizeContent();

		//следим за нажатием на удаление проекта
		$('.main__projects-list')
			.bind('click', this.deleteProject.bind(this));		
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

	startResizeContent() {

		let heights = {
			window: $(window).outerHeight(true),
			header: $('.header').outerHeight(true),
			footer: $('.footer').outerHeight(true)
		};

		this.myModel.resizeContent(heights);
	}
	deleteProject(event) {
		//нас интересуют только клики по элементу с атрибутом 'data-hash'
		let targetAttribute = event.target.getAttribute('data-hash');	
		if (targetAttribute) {
			// передаем модели название проекта на удаление
			this.myModel.deleteProject(targetAttribute);	
		} 
	}
}
