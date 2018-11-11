'use strict';

import {
	PubSubService
} from './PubSubService.js';

var ajaxHandlerScript = '../data/data.json';

//модель уровня PROMO
export class PromoModel {
	constructor() {
		this.users = [];
		this.layoutLink = '../img/layout-plaster.png';
		this.preloadedImagesH = {}; // ключ - имя предзагруженного изображения
		this.changes = new PubSubService();
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
			console.log(this.users);

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

	/*
	savingData() {
		//обращаемся к серверу и сохраняем данные

		//помечаем, что были данные сохранены
		this.contentSaved = true;

	}

	pubUnloadMessage(e) {
		//если данные не сохранены, то показываем уведомление
		if (!this.contentSaved) {
			e.returnValue = 'message';
		}
	}

	setContent() {
		//записываем из окон пользователя данные в поле модели
		//и нотифицируем слушателей об изменениях
		this.html = $('#HTML').prop('value');
		this.css = $('#CSS').prop('value');
		this.js = $('#JS').prop('value');
		this.changes.pub('changeContent', 'changesWasPublished');

		//помечаем, что были данные изменены, но не сохранены
		this.contentSaved = false;
	}

	setContentByTimer(e) {
		if (this.autoUpdate && (e.charCode || (e.which == 13) || (e.which == 8))) {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(this.setContent.bind(this), 500);
		}
		//помечаем, что были данные изменены, но не сохранены
		this.contentSaved = false;
	}

	setAutoUpdate(val) {
		this.autoUpdate = val;
		//и сохраняем в сессионное хранилище
		sessionStorage.autoUpdate = this.autoUpdate;
		this.changes.pub('changeAutoUpdate', 'changesWasPublished');
	}
	*/
}