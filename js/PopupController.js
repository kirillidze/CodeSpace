'use strict';

//контроллер уровня POPUP
export class PopupController {
	constructor(model) {
		this.myModel = model;

		//следим за нажатием вне попапа и по кнопкам закрытия
		$('.layout, .popup__close-cross, .popup__close-button')
			.click(
				this.pubClosePopup.bind(this)
			);

		//следим за нажатием по кнопке авторизации
		$('.popup__button[value="Log In"]')
			.click(
				this.startSetLogInInfo.bind(this)
			);

		//валидация входа и регистрации
		$('#LOGIN-FORM, #SIGNUP-FORM').validate({
			rules: {
				"user-nick": this.myModel.validateNickMap,
				"user-pass": this.myModel.validatePassMap
			}
		});
	}

	pubClosePopup() {
		this.myModel.changes.pub('hidePopup', 'changesWasPublished');
	}

	startSetLogInInfo() {
		this.myModel.setLogInInfo();
	}
}

