import * as _ from 'lodash';
import * as Path from 'path';
import Namespace from './Namespace';

export interface IClassName {
	namespace: string | Namespace;
	path: string[];
	name: string;
}

/**
 * Проверка типа IClassName.
 * @param value
 * @returns {boolean}
 */
export function isImplementsIClassName(value: any): value is IClassName {
	return (
		_.isObject(value)
		&& 'namespace' in value
		&& 'path' in value
		&& 'name' in value
		&& _.isString(value.namespace) || value.namespace instanceof Namespace
		&& value.path.reduce((result, item) => result && _.isString(item), true)
		&& _.isString(value.name)
	);
}

/**
 * Класс для работы с именами классов.
 * Имя класса состоит из: пространства имен, пути (пакеты), локальное имя класса.
 * Все части класса разделены точкой.
 * Например: Namespace1.path1.path2.path3.Class1.
 */
export default class ClassName implements IClassName {

	/**
	 * Проверка имени на правильное написание.
	 * @param {string} name
	 * @returns {boolean}
	 */
	static isValid(name: string): boolean {
		const parsedName: IClassName = this.parse(name);
		const nameRe = /^[A-Z]+([A-Z]?[a-z0-9]+)+$/;
		const pathItemRe = /^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/;
		return (
			name.indexOf('.') !== -1
			&& Namespace.isValid(parsedName.namespace as string)
			&& parsedName.path.reduce((result, item) => result && pathItemRe.test(item), true)
			&& nameRe.test(parsedName.name)
		);
	}

	/**
	 * Парсинг имени класса на составляющие.
	 * Параметр namespace нужен для случаев, когда пространства имен составное.
	 * @param {string} name
	 * @param {string} namespace
	 * @returns {IClassName}
	 */
	static parse(name: string, namespace: string = name.split('.')[0]): IClassName {
		if (name.indexOf(namespace) !== 0) {
			throw new Error(`Имя '${name}' не совпадает с пространством имен '${namespace}'.`);
		}
		name = name.trim();
		const pathAndClassName = name.replace(namespace + '.', '');
		const pathAndClassNameSplitted = pathAndClassName.split('.');
		return {
			namespace,
			path: pathAndClassNameSplitted.slice(0, pathAndClassNameSplitted.length - 1),
			name: pathAndClassNameSplitted.slice(-1)[0]
		};
	}

	/**
	 * Преобразование имени класса в путь к файлу с данным классом.
	 * Ext.util.Observable — path/to/src/util/Observable.js
	 * Ext.form.action.Submit — path/to/src/form/action/Submit.js
	 * MyCompany.chart.axis.Numeric — path/to/src/chart/axis/Numeric.js
	 * @param {string | ClassName} name
	 * @param {string} rootPath
	 */
	static toSourceFileName(name: string | IClassName, rootPath?: string) {
		name = isImplementsIClassName(name) ? name : this.parse(name);
		const result: string = (
			[].concat(rootPath ? rootPath : [])
			.concat(name.path)
			.concat(name.name)
			.join(Path.sep)
		);
		return result.length ? result + '.js' : '';
	}

	/**
	 * Пространство имен.
	 * @returns {Namespace}
	 */
	namespace: Namespace;

	/**
	 * Массив с частями пути к классу.
	 * @returns {string[]}
	 */
	path: string[];

	/**
	 * Краткое имя класса (последняя часть из частей отделенных точками).
	 * @returns {string}
	 */
	name: string;

	/**
	 * Полное имя класса.
	 * @returns {string}
	 */
	get text(): string {
		return ([]
			.concat(this.namespace.text || [])
			.concat(this.path)
			.concat(this.name || [])
			.join('.')
		);
	}

	/**
	 * Путь к файлу класса.
	 * Например 'path/to/src/util/Observable.js'.
	 * @returns {string}
	 */
	get sourceFileName(): string {
		return ClassName.toSourceFileName(this.text);
	}

	/**
	 * Конструктор.
	 * @param {string} text
	 * @param {string} namespace
	 */
	constructor(text: string = '', namespace?: string) {
		const parsedName = ClassName.parse(text, namespace);
		this.namespace = new Namespace(parsedName.namespace as string);
		this.path = parsedName.path;
		this.name = parsedName.name;
	}

	/**
	 * Полное имя класса.
	 * @returns {string}
	 */
	toString(): string {
		return this.text;
	}
}