'use strict';

import {
	DashboardModel
} from "./DashboardModel.js";
import {
	DashboardView
} from "./DashboardView.js";
import {
	DashboardController
} from "./DashboardController.js";

import {
	ProjectModel
} from "./ProjectModel.js";
import {
	UserWinView
} from "./UserWinView.js";
import {
	UserWinController
} from "./UserWinController.js";
import {
	OutputView
} from "./OutputView.js";
import {
	OutputController
} from "./OutputController.js";



export class Router {
	constructor(user) {
		this.user = user;

		this.modelOfList = new DashboardModel(this.user);
		this.viewOfList = new DashboardView(this.modelOfList);
		this.controllerOfList = new DashboardController(this.modelOfList);

		this.modelOfProject = null;
		this.viewOfuser = null;
		this.controllerOfUser = null;
		this.viewOfOutput = null;
		this.controllerOfOutput = null;

		// Подписаться на событие hashchange
		window.addEventListener('hashchange', this.onhashchange.bind(this));

		//сразу отслеживаем хеш (если был введён вручную при первом входе)
		this.onhashchange();
	}

	onhashchange() {
		const activeHash = document.location.hash;
		// Отрисовать страницу для нового адреса
		this.route(activeHash);
	}

	route(route) {
		//удаляем решётку
		route = route.substr(1);

		if (route === 'dashboard') {
			//инициируем MVC DASHBOARD
			this.modelOfList = new DashboardModel(this.user);
			this.viewOfList = new DashboardView(this.modelOfList);
			this.controllerOfList = new DashboardController(this.modelOfList);
		} else {
			//если проект существует

			//отписываем предыдущие представления от изменений модели
			if (this.viewOfOutput) {
				this.viewOfOutput.unsubscribe();
			}

			//инициируем общую модель проекта
			this.modelOfProject = new ProjectModel(route, this.user);

			//инициируем пользовательский MVC проекта (левый)
			this.viewOfuser = new UserWinView(this.modelOfProject);
			this.controllerOfUser = new UserWinController(this.modelOfProject);

			//инициируем MVCвывода данных проекта (правый)
			this.viewOfOutput = new OutputView(this.modelOfProject);
			this.controllerOfOutput = new OutputController(this.modelOfProject);
		}
	}

	navigateTo(route) {
		// Выполнить начальную навигацию на адрес по умолчанию
		if (document.location.hash === route && this.loaded) return;
		this.route(route);
		document.location.hash = route;
		this.loaded = true;
	}
}