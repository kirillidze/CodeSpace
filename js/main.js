'use strict';
window.addEventListener('DOMContentLoaded', documentReady, false);

function documentReady() {

	//чекбокс авторефреша
	let autoUpdate = $('#AUTO-UPDATE');

	autoUpdate.click(toggleRunButton);

	//прячем или показываем кнопку в зависимости
	//от настроек, выставленных до рефреша
	toggleRunButton();

	//скрываем/показываем кнопку обновления
	function toggleRunButton() {
		if (autoUpdate.prop('checked') === true) {
			$('#RUN-BUTTON').hide(0);
		} else {
			$('#RUN-BUTTON').show(0);
		}
	}

	function setSessionData() {
		sessionStorage.setItem('html', $('#HTML').prop('value'));
		sessionStorage.setItem('css', $('#CSS').prop('value'));
		sessionStorage.setItem('js', $('#JS').prop('value'));
	}

	//находим document у окна вывода
	let output = $('#OUTPUT')[0],
		outputDoc = output.contentWindow.document;

	//ф-ция добавления информации в окно вывода
	function addInfoInOutput() {
		$('<style>', {
			type: "text/css",
			text: $('#CSS').prop('value')
		}).appendTo(outputDoc.head);

		outputDoc.body.innerHTML = $('#HTML').prop('value');

		//в некоторых браузерах alert срабатывает раньше, чем DOM
		//даже если код будет в конце body, поэтому выполняем весь код
		//с задержкой
		let jsValue = $('#JS').prop('value');
		jsValue = `setTimeout( () => {${jsValue}}, 0);`;

		$('<script>', {
			type: "text/javascript",
			text: jsValue
		}).appendTo(outputDoc.body);
	}

	//если в сессионном хранилище ничего нет, то записываем данные
	if (sessionStorage.length === 0) {

		let ajaxHandlerScript = '../data/data.json',
			serverHtmlValue,
			serverCssValue,
			serverJsValue;

		let readReady = function(callresult) {
				if (callresult.error !== undefined)
					alert(callresult.error);
				else if (callresult !== "") {
					serverHtmlValue = callresult.user1.projects.project1.html;
					serverCssValue = callresult.user1.projects.project1.css;
					serverJsValue = callresult.user1.projects.project1.js;

					//отображаем данные в окнах
					$('#HTML').prop('value', serverHtmlValue);
					$('#CSS').prop('value', serverCssValue);
					$('#JS').prop('value', serverJsValue);

					//записываем в сессионное хранилище
					setSessionData();
					//отображаем в окне вывода
					addInfoInOutput();
				}
			},

			errorHandler = function(jqXHR) {
				alert(jqXHR.status + ' ' + jqXHR.statusText);
			};

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

		getProjectInfo().then(readReady, errorHandler);

		//иначе - читаем данные и перезаписываем в пользовательских окнах
	} else {
		let sessionHtmlValue = sessionStorage.getItem('html'),
			sessionCssValue = sessionStorage.getItem('css'),
			sessionJsValue = sessionStorage.getItem('js');

		$('#HTML').prop('value', sessionHtmlValue);
		$('#CSS').prop('value', sessionCssValue);
		$('#JS').prop('value', sessionJsValue);

		//отображаем в окне вывода
		addInfoInOutput();
	}

	//отображение содержимого окна во фрейме при изменении
	function showOutput() {
		//перезаписываем данные в сессионное хранилище
		setSessionData();
		//рефрешим страницу
		window.location.reload();
	}

	//обновляем данные через 500мс после окончания ввода
	$('.main__user-container').keyup(readyByTimer);

	//обновляем данные при клике на кнопку
	$('#RUN-BUTTON').click(showOutput);

	//задержка при вводе текста
	let timer = 0;

	//при выставленном чекбоксе и паузе при наборе будет
	//запущено обновление данных
	function readyByTimer() {
		if (autoUpdate.prop('checked') === true) {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(showOutput, 500);
		}
	}

}