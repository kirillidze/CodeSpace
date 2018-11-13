'use strict';

//контроллер уровня DASHBOARD
export class DashboardController {
	constructor(model) {
		this.myModel = model;
		this.startLoading();
	}

	startLoading() {
		//обращаемся к модели, чтобы она начала загрузку данных
		this.myModel.loadServerData();
	}
}