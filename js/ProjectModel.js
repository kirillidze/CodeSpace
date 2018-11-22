'use strict';

import {
	PubSubService
} from './PubSubService.js';

var ajaxHandlerScript = 'https://fe.it-academy.by/AjaxStringStorage2.php';

//общая модель уровня ПРОЕКТ
export class ProjectModel {
	constructor(project, user) {
		this.user = user;
		this.project = project;
		this.autoUpdate = null;
		this.html = null;
		this.css = null;
		this.js = null;
		this.title = null;
		this.changes = new PubSubService();
		this.contentSaved = true;
		this.timer = 0;
		// создадим промис заранее
		this.createPromise = (context, data) => {
			return new Promise((resolve, reject) => {
				try {
					$.ajax({
						url: ajaxHandlerScript,
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
					//если в сессионном хранилище есть данные о статусе автообновления,
					//то берём это значение
					if (sessionStorage.autoUpdate !== undefined) {
						this.autoUpdate = JSON.parse(sessionStorage.autoUpdate);
						//иначе берём данные с сервера
						//и запоминаем в хранилище
					} else {
						this.autoUpdate = dataFromServer[this.user].settings.autoUpdate;
						sessionStorage.autoUpdate = JSON.stringify(this.autoUpdate);
					}
					// проверим, есть ли такой проект
					if (dataFromServer[this.user].projects[this.project]) {
						this.html = dataFromServer[this.user].projects[this.project].html;
						this.css = dataFromServer[this.user].projects[this.project].css;
						this.js = dataFromServer[this.user].projects[this.project].js;
						this.title = dataFromServer[this.user].projects[this.project].title;
					} else {
						this.html = '';
						this.css = '';
						this.js = '';
						this.title = `${this.project}`;
					}
					//публикуем изменения при загрузке с сервера (открытие проекта)
					//т.к. ответ от сервера занимает время, то передаём аргументы
					//в публикации явно
					this.changes.pub(
						'changeOnload', {
							html: this.html,
							css: this.css,
							js: this.js,
							title: this.title,
							autoUpdate: this.autoUpdate
						}
					);
				}
			})
			.catch(error => {
				console.log("На этапе запроса на сервер случилась ошибка: " + error);
			});
	}

	savingData(data) {
		//обращаемся к серверу и сохраняем данные
		var self = this; // сохраняем контекст
		// если есть кнопка save, то авторизация пройдена и в хранилище УЖЕ есть имя юзера и проект
		// отправляем запрос на чтение и изменение
		this.createPromise(self, {
				f: 'LOCKGET',
				n: 'CodeSpace',
				p: 123
			})
			.then(response => {
				// ответ с сервера
				let oldData = JSON.parse(response.result);
				// формируем новую запись
				oldData[this.user].settings.autoUpdate = this.autoUpdate;

				oldData[this.user].projects[this.project] = data;

				// отправляем новые данные на сервер
				return this.createPromise(self, {
						f: 'UPDATE',
						n: 'CodeSpace',
						p: 123,
						v: JSON.stringify(oldData)
					})
					.then(response => {
						//если все успешно, придет "ок"
						console.log('Сохранение: ' + response.result);
						//помечаем, что были данные сохранены
						if (response.result == 'OK') {
							this.contentSaved = true;
							this.changes.pub('contentSaved', 'saved');
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

	pubUnloadMessage(e) {
		//если данные не сохранены, то показываем уведомление
		if (!this.contentSaved) {
			e.returnValue = 'message';
		}
	}

	setContent(data) {
		//записываем из окон пользователя данные в поле модели
		//и нотифицируем слушателей об изменениях
		this.html = data.html;
		this.css = data.css;
		this.js = data.js;
		this.title = data.title;
		this.changes.pub('changeContent', data);
		//помечаем, что были данные изменены, но не сохранены
		this.contentSaved = false;
	}

	setContentByTimer(e, data) {
		//проверяем что нажаты необходиме клавиши
		let symbol = /^[89]|(13)|(32)|((4|18)[6-9])|(([5-8]|10)\d)|(9[06-9])|(11[01])|((19|22)[0-2])|(219)$/
			.test(e.which);

		if (this.autoUpdate && symbol) {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(this.setContent.bind(this, data), 500);
		}
		//помечаем, что были данные изменены, но не сохранены
		this.contentSaved = false;
	}

	setAutoUpdate(data) {
		this.autoUpdate = data.autoUpdate;
		//и сохраняем в сессионное хранилище
		sessionStorage.autoUpdate = data.autoUpdate;
		this.changes.pub('changeAutoUpdate', data);
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

	changeButtonContainer(width) {
		if (width <= 950) {
			this.changes
				.pub('hideButtonContainer', 'changesWasPublished');
		}
	}
}