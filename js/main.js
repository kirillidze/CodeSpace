'use strict';
window.addEventListener('DOMContentLoaded', documentReady, false);

function documentReady() {

	class PubSubService {
		constructor() {
			//хэш всех подписок, в котором под каждым именем
			//свойства хранится массив подписчиков
			this.topics = {};
		}

		sub(topic, listener) {
			//если подписчик не функция - ничего не делаем
			if (typeof listener !== 'function') return;
			//если уже такая подписка есть (не пустая), то
			//читаем этот массив, иначе - создаём пустой массив
			const listeners = this.topics[topic] || [];
			const index = listeners.indexOf(listener);
			if (index == -1) {
				listeners.push(listener);
				this.topics[topic] = listeners;
			}
		}

		pub(topic, data) {
			const listeners = this.topics[topic] || [];
			//перебираем всех подписчиков по данной подписке
			//и вызываем
			for (let listener of listeners) {
				listener(data);
			}
		}

		remove(topic, listener) {
			const listeners = this.topics[topic] || [];
			const index = listeners.indexOf(listener);
			if (index > -1) {
				listeners.splice(index, 1);
				this.topics[topic] = listeners;
			}
		}

		removeAll(topic) {
			delete this.topics[topic];
		}
	}

	var ajaxHandlerScript = '../data/data.json';

	//общая модель уровня ПРОЕКТ
	class ProjectModel {
		constructor() {
			this.autoUpdate = null;
			this.html = null;
			this.css = null;
			this.js = null;
			this.changes = new PubSubService();
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
					//иначе то берём данные с сервера
					//и запоминаем в хранилище
				} else {
					this.autoUpdate = callresult.user1.settings.autoUpdate;
					sessionStorage.autoUpdate = this.autoUpdate;
				}


				this.html = callresult.user1.projects.project1.html;
				this.css = callresult.user1.projects.project1.css;
				this.js = callresult.user1.projects.project1.js;
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

		setContent() {
			//записываем из окон пользователя данные в поле модели
			//и нотифицируем слушателей об изменениях
			this.html = $('#HTML').prop('value');
			this.css = $('#CSS').prop('value');
			this.js = $('#JS').prop('value');
			this.changes.pub('changeContent', 'changesWasPublished');
		}

		setContentByTimer(e) {
			if (this.autoUpdate && (e.charCode || (e.which == 13) || (e.which == 8))) {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(this.setContent.bind(this), 500);
			}
		}

		setAutoUpdate(val) {
			this.autoUpdate = val;
			//и сохраняем в сессионное хранилище
			sessionStorage.autoUpdate = this.autoUpdate;
			this.changes.pub('changeAutoUpdate', 'changesWasPublished');
		}
	}

	//представление окон ввода данных уровня ПРОЕКТ (левая часть)
	class UserWinView {
		constructor(model) {
			this.myModel = model;
			//подписываемся на изменения
			this.myModel.changes.sub('changeOnload', this.updateWin.bind(this));
		}

		updateWin(data) {
			//отрисовывает полученные с сервера
			$('#HTML').prop('value', data.html);
			$('#CSS').prop('value', data.css);
			$('#JS').prop('value', data.js);
			$('#AUTO-UPDATE').prop('checked', data.autoUpdate);

			//показываем или прячем кнопку автообновления
			if (data.autoUpdate) {
				$('#RUN-BUTTON').hide(0);
			} else {
				$('#RUN-BUTTON').show(0);
			}
		}
	}

	//контроллер окон ввода данных уровня ПРОЕКТ (левая часть)
	class UserWinController {
		constructor(model) {
			this.myModel = model;
			this.startLoading();
		}

		startLoading() {
			//обращаемся к модели, чтобы она начала загрузку данных
			this.myModel.loadServerData();
		}
	}

	//представление окна ввывода данных уровня ПРОЕКТ (правая часть)
	class OutputView {
		constructor(model) {
			this.myModel = model;
			this.outputDoc = $('#OUTPUT')[0].contentWindow.document;
			//подписываемся на изменения
			this.myModel.changes.sub('changeOnload', this.updateOutput.bind(this));
			this.myModel.changes.sub('changeContent', this.updateOutput.bind(this));
			this.myModel.changes.sub('changeAutoUpdate', this.toggleRunButton.bind(this));
		}

		toggleRunButton() {
			if (this.myModel.autoUpdate) {
				$('#RUN-BUTTON').hide(0);
				//и сразу обновляем
				this.updateOutput();
			} else {
				$('#RUN-BUTTON').show(0);

			}
		}

		updateOutput(data) {
			this.outputDoc.head.innerHTML = '';
			//отображаем информацию в окне вывода
			$('<style>', {
				type: "text/css",
				text: this.myModel.css || data.css
			}).appendTo(this.outputDoc.head);

			//при загрузке проекта обращаемся к аргументу,
			//т.к. поля у модели к этому времени будут ещё null
			this.outputDoc.body.innerHTML = this.myModel.html || data.html;

			//в некоторых браузерах alert срабатывает раньше, чем DOM
			//даже если код будет в конце body, поэтому выполняем весь код
			//с задержкой
			$('<script>', {
				type: "text/javascript",
				text: `setTimeout( () => {${this.myModel.js || data.js}}, 0);`
			}).appendTo(this.outputDoc.body);

		}

	}

	//контроллер окна вывода данных уровня ПРОЕКТ (правая часть)
	class OutputController {
		constructor(model) {
			this.myModel = model;

			//следим за вводом данных в поля
			$('.main__user-container')
				.keypress(this.showOutputByTimer.bind(this));

			//следим за нажатием кнопки обновления
			$('#RUN-BUTTON')
				.click(this.showOutput.bind(this));

			//следим за изменением статуса чекбокса автообновления
			$('#AUTO-UPDATE').change(this.autoupdateChecked.bind(this));

		}

		showOutput() {
			this.myModel.setContent();
		}

		showOutputByTimer(e) {
			this.myModel.setContentByTimer(e);
		}

		autoupdateChecked() {
			this.myModel.setAutoUpdate($('#AUTO-UPDATE').prop('checked'));
		}

	}

	//инициируем левый MVC
	let model = new ProjectModel(),
		viewUser = new UserWinView(model),
		controllerUser = new UserWinController(model);

	//инициируем правый MVC
	let viewOutput = new OutputView(model),
		controllerOutput = new OutputController(model);

}