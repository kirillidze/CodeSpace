'use strict';

//представление окна ввывода данных уровня ПРОЕКТ (правая часть)
export class OutputView {
	constructor(model) {
		this.myModel = model;
		this.outputDoc = $('#OUTPUT')[0].contentWindow.document;
		this.dataFromHtmlBlock = '';
		this.isHead = null;
		this.isBody = null;
		

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
		if (this.myModel.html || data.html)	{
			this.dataFromHtmlBlock = this.myModel.html || data.html;		
			this.isHead = this.dataFromHtmlBlock.match(/\<head\>[\s\S]*\<\/head\>/gim);
			this.isBody = this.dataFromHtmlBlock.match(/\<body\>[\s\S]*\<\/body\>/gim);
			
			if (this.isHead) {
				this.outputDoc.head.innerHTML = this.isHead[0].slice(6, -7); 
			} 
			if (this.isBody) {
				this.outputDoc.body.innerHTML = this.isBody[0].slice(6, -7);
			} 
			if (!this.isBody && !this.isHead) {
				this.outputDoc.body.innerHTML = this.dataFromHtmlBlock;
			}
		}
		//при загрузке проекта обращаемся к аргументу,
		//т.к. поля у модели к этому времени будут ещё null
		//this.outputDoc.body.innerHTML = this.myModel.html || data.html;
		
		
		//отображаем информацию в окне вывода
		if(this.myModel.css || data.css) {
			$('<style>', {
				type: "text/css",
				text: this.myModel.css || data.css
			}).appendTo(this.outputDoc.head);
		}		
		//в некоторых браузерах alert срабатывает раньше, чем DOM
		//даже если код будет в конце body, поэтому выполняем весь код
		//с задержкой
		if (this.myModel.js || data.js) {
			$('<script>', {
				type: "text/javascript",
				text: `setTimeout( () => {${this.myModel.js || data.js}}, 500);`
			}).appendTo(this.outputDoc.body);
		}	
		
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
