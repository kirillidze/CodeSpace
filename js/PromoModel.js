'use strict';

import {
	PubSubService
} from './PubSubService.js';

var ajaxHandlerScript = 'https://fe.it-academy.by/AjaxStringStorage2.php';

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

					//создаём массив хэшей пользователь/пароль
					for (let user in dataFromServer) {

						this.users.push({
							userName: user,
							password: dataFromServer[user].password
						});
					}

					this.changes.pub('changeOnload', 'changesWasPublished');
				}
			})
			.catch(error => {
				console.log("На этапе запроса на сервер случилась ошибка: " + error);
			});

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

	setLogInInfo(userNick, userPass) {
		//стираем предыдущее имя юзера для повторного поиска
		this.activeUser = null;

		this.userNick = userNick;
		this.userPass = userPass;

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

	setSignUpInfo(userNick, userPass, validateError) {
		//стираем предыдущее имя юзера для повторного поиска
		this.activeUser = null;

		this.userNick = userNick;
		this.userPass = userPass;

		for (let i = 0; i < this.users.length; i++) {
			//если такой ник уже есть, то помечаем
			//что это имя не может использоваться
			if (this.users[i].userName.toLowerCase() == this.userNick.toLowerCase()) {
				this.activeUser = false;
				break;
			} else {
				this.activeUser = this.userNick;
			}
		}

		//проверяем на наличие ошибки валидации
		//и если она есть, то ничего не делаем
		if (validateError) {
			return;
		}

		//если ник не занят и нет ошибки валидации, то добавляем его в базу и сохраняем в localStorage
		if (this.activeUser) {
			localStorage.user = this.activeUser + '';
			this.createUser(this.userNick, this.userPass);
		} else {
			this.changes.pub('userWasFound', 'changesWasPublished');
		}

	}

	createUser(user, pass) {

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
				// формируем новую запись

				oldData[user] = {
					"password": pass,
					"settings": {
						"autoUpdate": true,
						"autoSave": false
					},
					"projects": {
						"project1": {
							"html": "",
							"css": "",
							"js": "",
							"title": "Untitled"
						}
					}
				};

				// отправляем новые данные на сервер
				return this.createPromise(self, {
						f: 'UPDATE',
						n: 'CodeSpace',
						p: 123,
						v: JSON.stringify(oldData)
					})
					.then(response => {
						//если все успешно, придет "ок"
						console.log('Сохранено: ' + response.result);
						//помечаем, что были данные сохранены
						if (response.result == 'OK') {
							this.changes.pub('changeUser', this.activeUser);
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

	resizeContent(heights, width) {

		let mainHeight = heights.window - heights.header - heights.footer;

		this.changes
			.pub('changeContentHeight', mainHeight);

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