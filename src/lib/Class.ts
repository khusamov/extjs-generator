import * as _ from 'lodash';
import { ObjectNode, StringNode } from 'khusamov-javascript-generator';
import Namespace from './Namespace';
import ClassName from './ClassName';

export default class Class extends ObjectNode {
	private config: any = {};
	namespace: Namespace | undefined;
	get extend(): string | undefined {
		return this.has('extend') ? this.get<StringNode>('extend').value as string : undefined;
	}
	set extend(parentClassName: string) {
		if (_.isNil(parentClassName)) {
			// Когда узел extend не определен, то в выходном коде его не должно быть, поэтому удаляем.
			// Иными словами extend равен имени класса или должен отсутствовать.
			this.remove(this.get('extend'));
		} else {
			if (!ClassName.isValid(parentClassName)) throw new Error(`Имя класса '${parentClassName}' ошибочное.`);
			if (!this.has('extend')) this.add('extend', StringNode);
			this.get<StringNode>('extend').value = parentClassName;
		}
	}

	/**
	 * Конструктор класса.
	 * Если указаны три аргумента, то аргумент namespaceOrConfig должен быть экземпляром класса Namespace.
	 * @param {string} name
	 * @param {Namespace | any | undefined} namespaceOrConfig
	 * @param config
	 */
	constructor(
		name: string,
		namespaceOrConfig?: Namespace | any | undefined,
		config: any = {}
	) {
		super(name);

		// Проверка имени класса.
		if (!ClassName.isValid(name)) throw new Error(`Имя класса '${name}' ошибочное.`);

		// Действия при разном количестве аргументов.
		// Определение this.namespace и this.config.
		switch (arguments.length) {
			case 2:
				if (namespaceOrConfig instanceof Namespace) {
					this.namespace = namespaceOrConfig;
				} else {
					this.config = namespaceOrConfig;
				}
				break;
			case 3:
				if (!(namespaceOrConfig instanceof Namespace)) {
					throw new Error([
						'Если указаны три аргумента, то аргумент namespaceOrConfig',
						'должен быть экземпляром класса Namespace.'
					].join(' '));
				}
				this.namespace = namespaceOrConfig;
				this.config = config;
				break;
		}

		if (this.namespace) {
			// Проверка, входит ли класс в данное пространство или нет.
			if (name.indexOf(this.namespace.text) !== 0) {
				throw new Error(`Класс '${name}' не входит в пространство имен '${this.namespace.text}'.`);
			}
			this.namespace.add(this);
		}
	}
}