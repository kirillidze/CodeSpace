'use strict';

//контроллер уровня DASHBOARD
export class DashboardController {
	constructor(model) {
		$('#CREATE-BUTTON').unbind('click');
		this.myModel = model;
		this.startLoading();

		//следим за нажатием кнопки выхода
		$('#LOGOUT-BUTTON')
			.click(
				this.startLogOut.bind(this)
			);

		//следим за нажатием кнопки создания нового проекта
		$('#CREATE-BUTTON')
			.click(
				this.createNewProject.bind(this)	
			);
	}

	startLoading() {
		//обращаемся к модели, чтобы она начала загрузку данных
		this.myModel.loadServerData();
	}

	startLogOut() {
		this.myModel.logOut();
	}

	createNewProject() {
		//обращаемся к модели, чтобы она начала создание проекта
		this.myModel.startNewProject();
	}
}
