'use strict';

//представление уровня POPUP
export class PopupView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes.sub('changePopup', this.showPopup.bind(this));
		this.myModel.changes.sub('hidePopup', this.hidePopup.bind(this));
		this.myModel.changes.sub('changeUser', this.hidePopup.bind(this));
		this.myModel.changes.sub('dataNotFound', this.showErrorLogIn.bind(this));
		this.myModel.changes.sub('userWasFound', this.showErrorSignUp.bind(this));
		this.myModel.changes.sub('changePopupData', this.hideErrorSignUp.bind(this));
	}

	showPopup(button) {
		$('.layout, .popup').css('display', 'block');

		if (button === 'logIn') {
			$('.popup__title_logIn').css('display', 'block');
			$('.popup__button[value="Log In"]').css('display', 'inline-block');
		} else if (button === 'signUp') {
			$('.popup__title_signUp').css('display', 'block');
			$('.popup__button[value="Sign Up"]').css('display', 'inline-block');
		}
	}

	hidePopup() {
		$('.layout, .popup, .popup__title, .popup__button_hide, .popup__error')
			.css('display', 'none');
		//очищаем поля
		$('.popup__text-place')
			.val('');
	}

	showErrorLogIn() {
		$('.popup__error_logIn').css('display', 'inline-block');
	}

	showErrorSignUp() {
		$('.popup__error_signUp').css('display', 'inline-block');
	}

	hideErrorSignUp() {
		$('.popup__error_signUp').css('display', 'none');
	}
}

