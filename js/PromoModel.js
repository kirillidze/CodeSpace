'use strict';

import {
	PubSubService
} from './PubSubService.js';

var ajaxHandlerScript = '../data/data.json';

//модель уровня PROMO
export class PromoModel {
	constructor() {
		this.userNick = null;
		this.userPass = null;
		this.activeUser = null;
		this.users = [];
		this.layoutLink = '../img/layout-plaster.png';
		this.preloadedImagesH = {}; // ключ - имя предзагруженного изображения
		this.changes = new PubSubService();

		//функция валидации
		this.userValidation = function(value, elem, regExp) {
			return regExp.test(value);
		};

		$.validator
			.addMethod('nickValue', this.userValidation, 'The name must start with a letter and can contain an underscore and a number');

		$.validator
			.addMethod('passValue', this.userValidation, 'The password must have numbers, uppercase and lowercase letters');

		this.validateNickMap = {
			required: true,
			minlength: 2,
			maxlength: 12,
			nickValue: /^[A-Za-zА-Яа-я]+[\wА-я]*$/
		};

		this.validatePassMap = {
			required: true,
			minlength: 6,
			maxlength: 20,
			passValue: /(\d+[A-ZА-Я]+[a-zа-я]+)|(\d+[a-zа-я]+[A-ZА-Я]+)|([A-ZА-Я]+[a-zа-я]+\d+)|([A-ZА-Я]+\d+[a-zа-я]+)|([a-zа-я]+[A-ZА-Я]+\d+)|([a-zа-я]+\d+[A-ZА-Я]+)/
		};
	}

	loadServerData() {
		//получаем данные с сервера
		let getProjectInfo = function() {
			return new Promise((resolve, reject) => {
				try {
					$.ajax({
						url: ajaxHandlerScript,
						type: 'GET',
						dataType: 'json',
						cache: false,
						success: resolve,
						error: reject
					});
				} catch (ex) {
					console.log(ex);
				}
			});
		};

		getProjectInfo().then(this._readReady.bind(this), this._errorHandler.bind(this));
	}

	_readReady(callresult) {
		if (callresult.error !== undefined)
			alert(callresult.error);
		else if (callresult !== "") {

			//создаём массив хэшей пользователь/пароль
			for (let user in callresult) {

				this.users.push({
					userName: user,
					password: callresult[user].password
				});
			}

			this.changes.pub('changeOnload', 'changesWasPublished');

		}
	}

	_errorHandler(jqXHR) {
		alert(jqXHR.status + ' ' + jqXHR.statusText);
	}

	preloadImage(fn) {
		// если такое изображение уже предзагружалось - ничего не делаем
		if (fn in this.preloadedImagesH)
			return;
		// предзагружаем - создаём невидимое изображение
		let img = new Image();
		img.src = fn; // загрузка начинается
		// запоминаем, что изображение уже предзагружалось
		this.preloadedImagesH[fn] = true;
	}

	setLogInInfo() {

		//стираем предыдущее имя юзера для повторного поиска
		this.activeUser = null;

		this.userNick = $('.popup__text-place[name="user-nick"]').val();
		this.userPass = $('.popup__text-place[name="user-pass"]').val();

		for (let i = 0; i < this.users.length; i++) {
			//если пароль и ник совпадают, то запоминаем ник
			if (this.users[i].userName == this.userNick && this.users[i].password == this.userPass) {
				this.activeUser = this.users[i].userName;
				break;
			}

		}

		//если ник получен, то публикуем его и сохраняем в localStorage
		if (this.activeUser) {
			localStorage.user = this.activeUser + '';
			this.changes.pub('changeUser', this.activeUser);
		} else {
			this.changes.pub('dataNotFound', 'changesWasPublished');
		}

	}

}