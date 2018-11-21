'use strict';

//представление окна ввывода данных уровня ПРОЕКТ (правая часть)
export class OutputView {
	constructor(model) {
		this.myModel = model;		
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
		// заменяем Iframe на новый
		$('<iframe>', {
			id: "OUTPUT",
			class: "main__ouput-window",
			src: "",
			sandbox: "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts",
			style: "display: block;"
		}).replaceAll($('#OUTPUT'));		           

		let outputDoc = $('#OUTPUT')[0].contentWindow.document,		
			scriptInHTML = null,
		 	newScriptArray = [],
			newScript = '',
			html = data.html;
		if (html) {
			//если в поле что-то есть, то пытаемся найти там script
			scriptInHTML = html.match(/<script>[\S\s]+?<\/script>/gim);			
		}
		if (scriptInHTML) {
			// если скрипты найдены, удаляем их из html и собираем вместе
			for (let i = 0; i < scriptInHTML.length; i++) {
				html = html.split(scriptInHTML[i]).join('');
				newScriptArray.push(scriptInHTML[i].slice(8, -9));
			}
		}
		// добавляем данные скрипта JS
		newScriptArray.push(data.js);
		if (newScriptArray.length > 0) {
			newScript = newScriptArray.join(';\n');
		}
		// ишем head
		let headContent = html.match(/<head>[\S\s]+?<\/head>/gim),
			headForIframe = null;
		//если head есть, вырезаем его из тега	
		if (headContent) {
			headForIframe = headContent[0].slice(6, -7);
		} else {		
			headForIframe = '';
		}
		// ищем body
		let bodyContent = html.match(/<body>[\S\s]+?<\/body>/gim),
			bodyForIframe = null;
		// если body есть, вырезаем его из тега
		if (bodyContent) {
			bodyForIframe = bodyContent[0].slice(6, -7);			
		} else {
		// если нет, оставляем html целиком	
			bodyForIframe = html;
		}
		// вписываем результат в iframe
		outputDoc.write(`<html>
			<head>
			${headForIframe} 			                          
			<style>${data.css}</style>
			</head>
			<body>
			${bodyForIframe}			
			</body>
			</html>`);
		// добавляем наш script в конец body
		setTimeout( () => {
			$('<script>').text(newScript).appendTo(outputDoc.body);
		}, 500);		
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
