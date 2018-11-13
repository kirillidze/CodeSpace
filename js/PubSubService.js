'use strict';

export class PubSubService {
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