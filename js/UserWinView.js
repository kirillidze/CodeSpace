'use strict';

//представление окон ввода данных уровня ПРОЕКТ (левая часть)
export class UserWinView {
	constructor(model) {
		//отписываем отслеживание
		$('.header__title__projectname').unbind();
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes.sub('changeOnload', this.updateWin.bind(this));

		//следим за двойным кликом по имени проекта
		$('.header__title__projectname')
			.dblclick(this.dblclickFunc.bind(this));
		//следим за уходом с имени проекта (редактирование закончено)
		$('.header__title__projectname')
			.blur(this.blurFunc.bind(this));
		//следим за нажатием клавиш на имени проекта (Escape и Enter будут значить, что редактирование закончено)
		$('.header__title__projectname')
			.keydown(this.keydownFunc.bind(this));
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

	dblclickFunc() {
		// двойной клик открывает редактирование
		$('.header__title__projectname')
			.attr("contentEditable", "true")
			.focus();
	}
	blurFunc() {
		// потеря фокуса закрывает редактирование
		$('.header__title__projectname')
			.attr("contentEditable", "false");
		$('body').focus();
	}
	keydownFunc(e) {
		// "Escape"	и "Enter" закрывают редактирование
		if (e.key == "Escape" || e.key == "Enter") {
			e.preventDefault();
			$('.header__title__projectname').attr("contentEditable", "false");
			$('body').focus();
		}
	}

}