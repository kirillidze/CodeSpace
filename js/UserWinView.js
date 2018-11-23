'use strict';

//представление окон ввода данных уровня ПРОЕКТ (левая часть)
export class UserWinView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes
			.sub('changeOnload', this.updateWin.bind(this));

		this.myModel.changes
			.sub('changeByDblclick', this.setEditable.bind(this));
		this.myModel.changes
			.sub('changeByBlur', this.removeEditable.bind(this));
		this.myModel.changes
			.sub('changeByKeydown', this.removeEditableByKeydown.bind(this));

	}

	updateWin(data) {
		//отрисовываем полученные с сервера данные
		ace.edit("HTML").setValue(data.html);
		ace.edit("CSS").setValue(data.css);
		ace.edit("JS").setValue(data.js);
		$('.header__title__projectname').text(data.title);
		$('#AUTO-UPDATE').prop('checked', data.autoUpdate);

		//показываем или прячем кнопку автообновления
		if (data.autoUpdate) {
			$('#RUN-BUTTON').hide(0);
		} else {
			$('#RUN-BUTTON').show(0);
		}
	}

	setEditable(e) {
		// двойной клик открывает редактирование		
		$('.header__title__projectname')
			.hide()
			.next('.header__title__input')
			.val(
				$('.header__title__projectname')
					.text()
			)
			.show()
			.focus();			
	}

	removeEditable(e) {
		// потеря фокуса закрывает редактирование				
		$('.header__title__input')
			.hide()
			.prev('.header__title__projectname')			
			.show();		
	}
  
	removeEditableByKeydown(e) {
		// "Escape"	и "Enter" закрывают редактирование		
		if (e.key == "Escape") {
			$('.header__title__input')
				.hide()
				.prev('.header__title__projectname')
				.show();
		} else if (e.key == "Enter") {			
			$('.header__title__input')
				.hide()
				.prev('.header__title__projectname')
				.text(
					$('.header__title__input')
						.val()
				)
				.show();
		} else return;			
	}
}
