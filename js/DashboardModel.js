'use strict';

import {
	PubSubService
} from './PubSubService.js';

//модель уровня DASHBOARD
export class DashboardModel {
	constructor(user) {
		this.user = user;
		this.list = null;
		this.changes = new PubSubService();
		// создадим промис зарание
		this.createPromise = (context, data) => {
			return new Promise((resolve, reject) => {
				try {
					$.ajax("https://fe.it-academy.by/AjaxStringStorage2.php", {
						type: 'POST',
						cache: false,
						dataType: 'json',
						context: context,
						data: data,
						success: resolve,
						error: reject
					});
				} catch (ex) {
					console.log(ex);
				}
			});
		};
	}

	loadServerData() {
		//получаем данные с сервера
		var self = this; // контекст для запроса
		//запрос на чтение
		this.createPromise(self, {
				f: 'READ',
				n: 'CodeSpace'
			})
			.then(response => {
				if (response.error !== undefined) {
					alert(response.error);
				} else if (response !== "") {
					// ответ с сервера
					let dataFromServer = JSON.parse(response.result);
					// проверим, есть ли у этого user-а проекты
					if (dataFromServer[this.user].projects)
						this.list = dataFromServer[this.user].projects;
				}
				//публикуем изменения при загрузке с сервера (открытие проекта)
				//т.к. ответ от сервера занимает время, то передаём аргументы
				//в публикации явно
				this.changes.pub('changeListOnload', this.list);
			})
			.catch(error => {
				console.log("На этапе запроса на сервер случилась ошибка: " + error);
			});
	}

	logOut() {
		localStorage.clear();
		sessionStorage.clear();
		this.changes.pub('logOut', 'changesWasPublished');
	}

	createNewProject() {
		//создадим дату для уникальности проекта
		let currentDate = Date.now();
		//и опубликуем её для последующей навигации в роутинге
		this.changes.pub('createNewProject', currentDate);
	}

	resizeContent(heights, width) {

		let mainHeight = heights.window - heights.header - heights.footer;

		this.changes.pub('changeContentHeight', mainHeight);

		if (width > 950) {
			this.changes
				.pub('changePageWidth', 'changesWasPublished');
		}
	}

	deleteProject(projectName) {
		//обращаемся к серверу и сохраняем данные
		var self = this; // сохраняем контекст
		// отправляем запрос на чтение и изменение
		this.createPromise(self, {
				f: 'LOCKGET',
				n: 'CodeSpace',
				p: 123
			})
			.then(response => {
				// ответ с сервера
				let oldData = JSON.parse(response.result);
				// удаляем проект
				delete oldData[this.user].projects[projectName];
				// отправляем новые данные на сервер
				return this.createPromise(self, {
						f: 'UPDATE',
						n: 'CodeSpace',
						p: 123,
						v: JSON.stringify(oldData)
					})
					.then(response => {
						//если все успешно, придет "ок"
						console.log('Удалено: ' + response.result);
						// удалили проект - оповестим представление, чтобы обновило страницу и показало сообщение
						if (response.result == 'OK') {
							this.changes.pub('changeProjectList', projectName);
						}
					})
					.catch(error => {
						console.log("На этапе записи на сервер случилась ошибка: " + error);
					});
			})
			.catch(error => {
				console.log("На этапе запроса на сервер случилась ошибка: " + error);
			});
	}
}