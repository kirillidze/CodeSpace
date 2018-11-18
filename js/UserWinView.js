'use strict';

//представление окон ввода данных уровня ПРОЕКТ (левая часть)
export class UserWinView {
	constructor(model) {
		//отписываем отслеживание
		$('.header__title__projectname').unbind();
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes.sub('changeOnload', this.updateWin.bind(this));
		this.myModel.changes.sub('contentSaved', this.showSaveMessage.bind(this));
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

		//показываем кнопки и чекбокс
		$('#AUTO-UPDATE')
			.css('display', 'inline-block');
		$('.header__auto-update-label')
			.css('display', 'inline-block');
		$('#RUN-BUTTON')
			.css('display', 'inline-block');
		$('#SAVE-BUTTON')
			.css('display', 'inline-block');
		$('#LOGOUT-BUTTON')
			.css('display', 'inline-block');
		$('#CREATE-BUTTON')
			.css('display', 'inline-block');

		//показываем окна ввода и вывода
		$('.main__user-container')
			.css('display', 'block');
		$('.main__ouput-window')
			.css('display', 'block');

		$('.header__dashboard-link')
			.css('display', 'inline-block');

		$('.main__projects-list')
			.css('display', 'none');

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
		//показываем имя пользователя и имя проекта
		$('.header__title')
			.css('display', 'block');
		$('.header__title__username, .header__title__projectname')
			.css('display', 'inline-block');
		$('.header__title__username')
			.text(`${this.myModel.user} / `);
	}
	showSaveMessage() {
		//показываем на 3сек сообщение о сохранении
		$('.save, .layout__save__message')
			.css('display', 'block')
			.fadeOut(3000);
	}
	dblclickFunc(e) {
		// двойной клик открывает редактирование
		$('.header__title__projectname')
			.attr("contentEditable", "true")
			.focus();
	}
	blurFunc(e) {
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
