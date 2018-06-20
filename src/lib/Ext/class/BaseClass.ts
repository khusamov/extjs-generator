import * as _ from 'lodash';
import { ObjectNode, StringNode, ArrayNode } from 'khusamov-javascript-generator';
import Namespace from '../Namespace';
import ClassName from '../ClassName';
import ClassNameValidError from '../ClassNameValidError';
import {
	TStringOrStringArray,
	isTStringOrStringArray,
	isEmptyStringOrStringArray
} from '../type/TStringOrStringArray';

/**
 * Имитация базового класса.
 * @link http://docs.sencha.com/extjs/6.5.3/classic/Ext.Base.html
 * @link http://docs.sencha.com/extjs/6.5.3/classic/Ext.Class.html
 */
export default class BaseClass extends ObjectNode {

	static valueDefault = {
		extend: '',
		override: '',
		alias: '',
		xtype: '',
		requires: [],
		uses: []
	};

	namespace: Namespace | undefined;

	/**
	 * Родительский класс.
	 * @returns {string | undefined}
	 */
	get extend(): string | undefined {
		return this.get<StringNode>('extend').value as string;
	}
	set extend(parentClassName: string | undefined) {
		if (_.isString(parentClassName) && !ClassName.isValid(parentClassName)) {
			throw new ClassNameValidError(parentClassName);
		}
		this.get<StringNode>('extend').value = parentClassName;
	}

	/**
	 * Переопределение класса.
	 * Если определен, то этот класс переопределяет члены указанного целевого класса..
	 * @returns {string | undefined}
	 */
	get override(): string | undefined {
		return this.get<StringNode>('override').value as string;
	}
	set override(parentClassName: string | undefined) {
		if (!ClassName.isValid(parentClassName)) throw new ClassNameValidError(parentClassName);
		this.get<StringNode>('override').value = parentClassName;
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
	 * Является ли данный класс переопределением другого класса через свойство override или нет.
	 * @returns {boolean}
	 */
	get isOverride(): boolean {
		return _.isString(this.override) && !this.override.trim();
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
		if (!ClassName.isValid(name)) throw new ClassNameValidError(name);

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

		super(name, _.merge({}, BaseClass.valueDefault, config));

		// Добавление класса в заданное пространство имен.
		if (namespace) {
			namespace.add(this);
			this.namespace = namespace;
		}

		this.initClass();
	}

	/**
	 * Специальный метод для переопределения в потомках.
	 * Должен содержать код инициализации класса.
	 * Запускается после выполнения конструктора.
	 */
	initClass() {};
}