'use strict';

import {
	PubSubService
} from './PubSubService.js';

//модель уровня DASHBOARD
export class DashboardModel {
	constructor(user) {
		this.user = user;
		this.list = null;
		this.changes = new PubSubService();
		// создадим промис зарание
		this.createPromise = (context, data) => {
			return new Promise( (resolve,reject) => {
				try {
					$.ajax("https://fe.it-academy.by/AjaxStringStorage2.php",
					{
						type: 'POST',
						cache : false, 
						dataType :'json',
						context : context,						
						data : data,                                            
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
		this.createPromise(self, {f : 'READ', n : 'CodeSpace'})
		.then( response => {  
			if (response.error != undefined) {
				alert(response.error);
			} else if (response != "") {
				// ответ с сервера				
				let dataFromServer = JSON.parse(response.result);
				// проверим, есть ли у этого user-а проекты
				if (dataFromServer[this.user].projects)
				console.log(dataFromServer[this.user].projects);
				this.list = dataFromServer[this.user].projects;
			}
			//публикуем изменения при загрузке с сервера (открытие проекта)
			//т.к. ответ от сервера занимает время, то передаём аргументы
			//в публикации явно
			this.changes.pub('changeListOnload', this.list);
		})
		.catch( error => {
			console.log("На этапе запроса на сервер случилась ошибка: "+error);
		});
	}	

	logOut() {
		localStorage.clear();
		this.changes.pub('logOut', 'changesWasPublished');
	}	
}

