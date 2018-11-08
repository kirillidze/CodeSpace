'use strict';

import {
	PubSubService
} from './PubSubService.js';

var ajaxHandlerScript = '../data/data.json';

//общая модель уровня ПРОЕКТ
export class ProjectModel {
	constructor(project, user) {
		this.user = user;
		this.project = project;
		this.autoUpdate = null;
		this.html = null;
		this.css = null;
		this.js = null;
		this.changes = new PubSubService();
		this.contentSaved = true;
		this.timer = 0;
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
			//если в сессионном хранилище есть данные о статусе автообновления,
			//то берём это значение
			if (sessionStorage.length) {
				this.autoUpdate = JSON.parse(sessionStorage.autoUpdate);
				//иначе берём данные с сервера
				//и запоминаем в хранилище
			} else {
				this.autoUpdate = callresult[this.user].settings.autoUpdate;
				sessionStorage.autoUpdate = this.autoUpdate;
			}

			this.html = callresult[this.user].projects[this.project].html;
			this.css = callresult[this.user].projects[this.project].css;
			this.js = callresult[this.user].projects[this.project].js;
			//публикуем изменения при загрузке с сервера (открытие проекта)
			//т.к. ответ от сервера занимает время, то передаём аргументы
			//в публикации явно
			this.changes.pub(
				'changeOnload', {
					html: this.html,
					css: this.css,
					js: this.js,
					autoUpdate: this.autoUpdate
				}
			);
		}
	}

	_errorHandler(jqXHR) {
		alert(jqXHR.status + ' ' + jqXHR.statusText);
	}

	savingData() {
		//обращаемся к серверу и сохраняем данные
		//.........

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
		//this.html = $('#HTML').prop('value');
		//this.css = $('#CSS').prop('value');
		//this.js = $('#JS').prop('value');
		this.html = ace.edit("HTML").getValue();
            	this.css = ace.edit("CSS").getValue();
            	this.js = ace.edit("JS").getValue();
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
}
