import Namespace from './Namespace';

export interface IClassName {
	name: string;
	path: string[];
	namespace: Namespace;
}

export default class ClassName {
	get path(): string[] {
		return [];
	}
	get namespace(): Namespace {
		return undefined;
	}
	get name(): string {
		return '';
	}

	/**
	 * Проверка имени на правильное написание.
	 * @param {string} name
	 * @returns {boolean}
	 */
	static isValid(name: string): boolean {
		return false;
	}

	/**
	 * Парсинг имени класса на составляющие.
	 * Параметр namespace нужен для случаев, когда пространства имен составное.
	 * @param {string} name
	 * @param {string} namespace
	 * @returns {IClassName}
	 */
	static parse(name: string, namespace?: string | Namespace): IClassName {
		namespace = namespace
			? namespace instanceof Namespace ? namespace : new Namespace(namespace)
			: new Namespace(name.split('.')[0]);

		if (name.indexOf(namespace.text) !== 0) {
			throw new Error(`Имя '${name}' не совпадает с пространством имен '${namespace.text}'.`);
		}

		const pathAndClassName = name.replace(namespace.text + '.', '');
		const pathAndClassNameSplitted = pathAndClassName.split('.');
		return {
			name: pathAndClassNameSplitted.slice(-1)[0],
			path: pathAndClassNameSplitted.slice(0, pathAndClassNameSplitted.length - 1),
			namespace: namespace
		};
	}
	constructor(public text: string = '') {}
}