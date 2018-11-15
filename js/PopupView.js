'use strict';

//представление уровня POPUP
export class PopupView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes.sub('changePopup', this.showPopup.bind(this));
		this.myModel.changes.sub('hidePopup', this.hidePopup.bind(this));
		this.myModel.changes.sub('changeUser', this.hidePopup.bind(this));
		this.myModel.changes.sub('dataNotFound', this.showErrorMessage.bind(this));
	}

	showPopup(button) {
		$('.layout, .popup').css('display', 'block');

		if (button === 'logIn') {
			$('.popup__authorization').css('display', 'block');
		} else if (button === 'signUp') {
			$('.popup__registration').css('display', 'block');
		}
	}

	hidePopup() {
		$('.layout, .popup, .popup__authorization, .popup__registration, .popup__error-message')
			.css('display', 'none');
	}

	showErrorMessage() {
		$('.popup__error-message').css('display', 'inline-block');
	}
}

