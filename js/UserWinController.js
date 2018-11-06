'use strict';

//контроллер окон ввода данных уровня ПРОЕКТ (левая часть)
export class UserWinController {
	constructor(model) {
		this.myModel = model;
		this.startLoading();
	}

	startLoading() {
		//обращаемся к модели, чтобы она начала загрузку данных
		this.myModel.loadServerData();
	}
}