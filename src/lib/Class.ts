import * as _ from 'lodash';
import { ObjectNode, StringNode, ArrayNode } from 'khusamov-javascript-generator';
import Namespace from './Namespace';
import ClassName from './ClassName';
import {
	TStringOrStringArray,
	isTStringOrStringArray,
	isEmptyStringOrStringArray
} from './type/TStringOrStringArray';

export default class Class extends ObjectNode {
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
	get requires(): ArrayNode {
		if (!this.has('requires')) this.add('requires', ArrayNode);
		return this.get<ArrayNode>('requires');
	}
	get uses(): ArrayNode {
		if (!this.has('uses')) this.add('uses', ArrayNode);
		return this.get<ArrayNode>('uses');
	}
	get alias(): TStringOrStringArray | undefined {
		return (
			this.has('alias')
				? this.get<StringNode | ArrayNode>('alias').value as (string | string[])
				: undefined
		);
	}
	set alias(alias: TStringOrStringArray) {
		if (isEmptyStringOrStringArray(alias)) {
			// Когда узел alias не определен, то в выходном коде его не должно быть, поэтому удаляем.
			// Иными словами нельзя допускать вариантов: alias: undefined, alias: null, alias: '',
			// alias: [], alias: [''] и т.п.
			this.remove(this.get('alias'));
		} else {
			if (!isTStringOrStringArray(alias)) throw new Error('Задан неправильный псевдоним класса.');
			if (!this.has('alias')) {
				this.add('alias', _.isString(alias) ? StringNode : ArrayNode);
				if (_.isArray(alias)) this.get<ArrayNode>('alias').unique = true;
			}
			this.get<StringNode | ArrayNode>('alias').value = alias;
		}
	}

	/**
	 * Конструктор класса.
	 * Если указаны три аргумента, то аргумент namespaceOrConfig должен быть экземпляром класса Namespace.
	 * @param {string} name
	 * @param {Namespace | any | undefined} namespaceOrConfig
	 * @param {object} config
	 */
	constructor(
		name: string,
		namespaceOrConfig?: Namespace | any | undefined,
		config: object = {}
	) {
		// Проверка имени класса.
		if (!ClassName.isValid(name)) throw new Error(`Имя класса '${name}' ошибочное.`);

		// Определение namespace и config в зависимости от количества аргументов.
		let namespace: Namespace;
		switch (arguments.length) {
			case 2:
				if (namespaceOrConfig instanceof Namespace) {
					namespace = namespaceOrConfig;
				} else {
					config = namespaceOrConfig;
				}
				break;
			case 3:
				if (!(namespaceOrConfig instanceof Namespace)) {
					throw new Error([
						'Если указаны три аргумента, то аргумент namespaceOrConfig',
						'должен быть экземпляром класса Namespace.'
					].join(' '));
				}
				namespace = namespaceOrConfig;
				break;
		}

		// Проверка, входит ли класс в заданное пространство имен или нет.
		if (namespace && name.indexOf(namespace.text) !== 0) {
			throw new Error(`Класс '${name}' не входит в пространство имен '${namespace.text}'.`);
		}

		super(name, config);

		// Добавление класса в заданное пространство имен.
		if (namespace) {
			namespace.add(this);
			this.namespace = namespace;
		}

		this.initClass();
	}

	initClass() {};
}