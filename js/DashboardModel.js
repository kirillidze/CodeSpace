'use strict';

import {
	PubSubService
} from './PubSubService.js';

var ajaxHandlerScript = '../data/data.json';

//модель уровня DASHBOARD
export class DashboardModel {
	constructor(user) {
		this.user = user;
		this.list = null;
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

			this.list = callresult[this.user].projects;

			//публикуем изменения при загрузке с сервера (открытие проекта)
			//т.к. ответ от сервера занимает время, то передаём аргументы
			//в публикации явно
			this.changes.pub('changeListOnload', this.list);
		}
	}

	_errorHandler(jqXHR) {
		alert(jqXHR.status + ' ' + jqXHR.statusText);
	}

	logOut() {
		localStorage.clear();
		this.changes.pub('logOut', 'changesWasPublished');
	}	
}
