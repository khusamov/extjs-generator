import * as _ from 'lodash';
import Namespace from './Namespace';

export interface IClassName {
	namespace: string | Namespace;
	path: string[];
	name: string;
}

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

export default class ClassName implements IClassName {
	get path(): string[] {
		return ClassName.parse(this.text).path;
	}
	get namespace(): Namespace {
		return new Namespace(ClassName.parse(this.text).namespace as string);
	}
	get name(): string {
		return ClassName.parse(this.text).name;
	}
	get sourceFileName(): string {
		return ClassName.toSourceFileName(this.text);
	}

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
			Namespace.isValid(parsedName.namespace as string)
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
			.join('/')
		);
		return result.length ? result + '.js' : '';
	}
	constructor(public text: string = '') {}
}