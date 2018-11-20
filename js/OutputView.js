'use strict';

//представление окна ввывода данных уровня ПРОЕКТ (правая часть)
export class OutputView {
	constructor(model) {
		this.myModel = model;
		this.outputDoc = $('#OUTPUT')[0].contentWindow.document;

		this.newHTML = '';
		this.newScript = '';
		this.newScriptArray = [];
		this.scriptInHTML = [];
		this.newCss = '';

		this.updateOutputHandler = this.updateOutput.bind(this);
		this.toggleAutoUpdateHandler = this.toggleAutoUpdate.bind(this);

		//подписываемся на изменения
		this.myModel.changes.sub('changeOnload', this.updateOutputHandler);
		this.myModel.changes.sub('changeContent', this.updateOutputHandler);
		this.myModel.changes.sub('changeAutoUpdate', this.toggleAutoUpdateHandler);
	}

	toggleAutoUpdate(data) {
		if (data.autoUpdate) {
			//сразу обновляем
			this.updateOutput(data);
		}
	}

	updateOutput(data) {
		this.outputDoc.body.innerHTML = ''; //обнуляем body
		this.outputDoc.head.innerHTML = ''; // обнуляем head
		this.newScriptArray = [];
		this.newHTML = data.html; // читаем данные html
		if (this.newHTML) {
			//если в поле что-то есть, то пытаемся найти там script
			this.scriptInHTML = this.newHTML
				.match(/<script>[\S\s]+?<\/script>/gim);
		}
		if (this.scriptInHTML) {
			// если скрипты найдены, удаляем их из html и собираем вместе
			for (let i = 0; i < this.scriptInHTML.length; i++) {
				this.newHTML = this.newHTML.split(this.scriptInHTML[i]).join('');

				this.newScriptArray.push(this.scriptInHTML[i].slice(8, -9));
			}
		}
		// добавляем данные скрипта JS
		this.newScriptArray.push(data.js);
		if (this.newScriptArray.length > 0) {
			this.newScript = this.newScriptArray.join(';\n');
		}
		//убираем undefined
		if (data.css) {
			this.newCss = data.css;
		} else this.newCss = '';

		// записываем во фрейм то, что получилось
		this.outputDoc.write(`<html>
		<body>
		<style>${this.newCss}</style>
		${this.newHTML}
		<script>
		setTimeout( () => {${this.newScript}}, 500);
		<\/script>
		</body>
		</html>`);

	}

	unsubscribe() {
		//отписываемся от изменений модели
		this.myModel.changes
			.remove('changeOnload', this.updateOutputHandler);
		this.myModel.changes
			.remove('changeContent', this.updateOutputHandler);
		this.myModel.changes
			.remove('changeAutoUpdate', this.toggleAutoUpdateHandler);
	}

}