'use strict';

//представление окна ввывода данных уровня ПРОЕКТ (правая часть)
export class OutputView {
	constructor(model) {
		this.myModel = model;
		this.outputDoc = $('#OUTPUT')[0].contentWindow.document;

		this.updateOutputHandler = this.updateOutput.bind(this);
		this.toggleRunButtonHandler = this.toggleRunButton.bind(this);

		//подписываемся на изменения
		this.myModel.changes.sub('changeOnload', this.updateOutputHandler);
		this.myModel.changes.sub('changeContent', this.updateOutputHandler);
		this.myModel.changes.sub('changeAutoUpdate', this.toggleRunButtonHandler);
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
			text: `setTimeout( () => {${this.myModel.js || data.js}}, 500);`
		}).appendTo(this.outputDoc.body);
	}

	unsubscribe() {
		//отписываемся от изменений модели
		this.myModel.changes
			.remove('changeOnload', this.updateOutputHandler);
		this.myModel.changes
			.remove('changeContent', this.updateOutputHandler);
		this.myModel.changes
			.remove('changeAutoUpdate', this.toggleRunButtonHandler);
	}

}