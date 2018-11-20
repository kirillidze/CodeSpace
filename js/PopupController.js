'use strict';

//контроллер уровня POPUP
export class PopupController {
	constructor(model) {
		this.myModel = model;

		//отписываем все предыдущие события
		$('.popup__button[value="Log In"], .popup__button[value="Sign Up"]')
			.unbind('click');

		//следим за нажатием вне попапа и по кнопкам закрытия
		$('.layout, .popup__close-cross, .popup__button[value="Close"]')
			.click(
				this.pubClosePopup.bind(this)
			);

		//следим за нажатием по кнопке авторизации
		$('.popup__button[value="Log In"]')
			.click(
				this.startSetLogInInfo.bind(this)
			);

		//следим за нажатием по кнопке регистрации
		$('.popup__button[value="Sign Up"]')
			.click(
				this.startSetSignUpInfo.bind(this)
			);

		//валидация полей ввода
		$('#POPUP-FORM').validate({
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
		let userNick = $('.popup__text-place[name="user-nick"]').val(),
			userPass = $('.popup__text-place[name="user-pass"]').val();

		this.myModel.setLogInInfo(userNick, userPass);
	}

	startSetSignUpInfo() {
		let userNick = $('.popup__text-place[name="user-nick"]').val(),
			userPass = $('.popup__text-place[name="user-pass"]').val();

		let validateError = $('.popup__text-place')
			.hasClass('error');

		this.myModel.changes.pub('changePopupData', 'changesWasPublished');

		this.myModel.setSignUpInfo(userNick, userPass, validateError);

	}
}
