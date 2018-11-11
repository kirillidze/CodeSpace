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
		this.outputDoc.body.innerHTML = '';
		this.outputDoc.write(`<html>
                <head><style>${this.myModel.css || data.css}</style></head>
                <body>${this.myModel.html || data.html}
                <script>${this.myModel.js || data.js}<\/script>
                </body></html>`);
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
