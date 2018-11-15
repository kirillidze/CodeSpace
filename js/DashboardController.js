'use strict';

//контроллер уровня DASHBOARD
export class DashboardController {
	constructor(model) {
		this.myModel = model;
		this.startLoading();

		//следим за нажатием кнопки выхода
		$('#LOGOUT-BUTTON')
			.click(
				this.startLogOut.bind(this)
			);
	}

	startLoading() {
		//обращаемся к модели, чтобы она начала загрузку данных
		this.myModel.loadServerData();
	}

	startLogOut() {
		this.myModel.logOut();
	}
}
