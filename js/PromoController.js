'use strict';

//контроллер уровня PROMO
export class PromoController {
	constructor(model) {
		this.myModel = model;

		//следим за нажатием кнопки входа
		$('#LOGIN-BUTTON')
			.click(
				this.pubClickOnButton.bind(this, 'logIn')
			);

		//следим за нажатием кнопки регистрации
		$('#SIGNUP-BUTTON')
			.click(
				this.pubClickOnButton.bind(this, 'signUp')
			);

		this.startLoading();
	}

	startLoading() {
		//обращаемся к модели, чтобы она начала загрузку данных
		this.myModel.loadServerData();

		this.myModel.preloadImage(this.myModel.layoutLink);
	}

	pubClickOnButton(button) {
		this.myModel.changes.pub('changePopup', button);
	}


}