'use strict';

//контроллер уровня PROMO
export class PromoController {
	constructor(model) {
		this.myModel = model;

		// предварительно отписываемся от событий
		$('.header__bars-menu, .header__button-container-layout, #SIGNUP-BUTTON, #LOGIN-BUTTON')
			.unbind('click');

		$(window)
			.resize(
				this.startResizeContent.bind(this)
			);

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

		//следим за нажатием по бургеру или по слою бургера
		$('.header__bars-menu, .header__button-container-layout')
			.click(
				this.startToggleButtonContainer
				.bind(this)
			);

		this.startLoading();
		this.startResizeContent();
	}

	startLoading() {
		//обращаемся к модели, чтобы она начала загрузку данных
		this.myModel.loadServerData();

		this.myModel.preloadImage(this.myModel.layoutLink);
	}

	pubClickOnButton(button) {
		this.myModel.changes.pub('changePopup', button);

		let width = $(window).outerWidth();
		this.myModel.changeButtonContainer(width);
	}

	startResizeContent() {

		let heights = {
				window: $(window).outerHeight(true),
				header: $('.header').outerHeight(true),
				footer: $('.footer').outerHeight(true)
			},
			width = $(window).outerWidth();

		this.myModel.resizeContent(heights, width);

	}

	startToggleButtonContainer() {
		this.myModel.changes
			.pub('changeButtonContainer', 'changesWasPublished');
	}

}