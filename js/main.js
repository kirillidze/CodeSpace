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

	//если в сессионном хранилище ничего нет, то записываем данные
	if (sessionStorage.length === 0) {
		//первоначальные состояния окон пользователя (для примера)
		//в итоге ранее сохранённые данные будут браться с сервера
		let serverHtmlValue = '<div></div><br/><input type="button" value="Кнопка">',
			serverCssValue = 'div {width: 100px; height: 100px; border-radius: 50px; background-color: green;}',
			serverJsValue = `alert('ну, привет');`;

		//отображаем данные в окнах
		$('#HTML').prop('value', serverHtmlValue);
		$('#CSS').prop('value', serverCssValue);
		$('#JS').prop('value', serverJsValue);

		//записываем в сессионное хранилище
		setSessionData();
		//иначе - читаем данные и перезаписываем в пользовательских окнах
	} else {
		let sessionHtmlValue = sessionStorage.getItem('html'),
			sessionCssValue = sessionStorage.getItem('css'),
			sessionJsValue = sessionStorage.getItem('js');

		$('#HTML').prop('value', sessionHtmlValue);
		$('#CSS').prop('value', sessionCssValue);
		$('#JS').prop('value', sessionJsValue);
	}

	//находим document у окна вывода
	let output = $('#OUTPUT')[0],
		outputDoc = output.contentWindow.document;

	//создаём теги стилей и скрипта и добавляем их в head у окна вывода
	$('<style>', {
		type: "text/css",
		text: $('#CSS').prop('value')
	}).appendTo(outputDoc.head);

	outputDoc.body.innerHTML = $('#HTML').prop('value');

	$('<script>', {
		type: "text/javascript",
		text: $('#JS').prop('value')
	}).appendTo(outputDoc.body);



	/*
		//создаём теги стилей и скрипта и добавляем их в head у окна вывода
		outputDoc.head.append('<style id="OUTPUT-STYLE" type="text/css">' + $('#CSS').prop('value') + '</style>');
		outputDoc.head.append('<script id="OUTPUT-SCRIPT" type="text/javascript">' + $('#JS').prop('value') + '</script>');
		outputDoc.body.innerHTML = $('#HTML').prop('value');
	*/
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