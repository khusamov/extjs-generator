import Namespace from './Namespace';
import Class from './Class';

/**
 * Менеджер пространств имен.
 */
export default class Manager {
	private namespaces: Namespace[] = [];

	/**
	 * Количество пространств имен под управлением менеджера.
	 * @returns {number}
	 */
	get count(): number {
		return this.namespaces.length;
	}

	/**
	 * Добавить пространство имен.
	 * Пространство не должно присутствовать в менеджере или пересекаться с имеющимися.
	 * @param {Namespace} namespace
	 * @returns {Manager}
	 */
	add(namespace: Namespace): this {
		const existsNamespace: boolean = !!this.get(namespace.text);
		if (existsNamespace) {
			throw new Error(`Пространство имен '${namespace.text}' уже присутствует в менеджере.`);
		}

		const intersectedNamespace = this.namespaces.find(testedNamespace => (
			testedNamespace.text.indexOf(namespace.text) === 0
			|| namespace.text.indexOf(testedNamespace.text) === 0
		));
		if (intersectedNamespace) {
			throw new Error(`Пространство имен '${namespace.text}' пересекается с '${intersectedNamespace.text}'.`);
		}

		namespace.manager = this;
		this.namespaces.push(namespace);
		return this;
	}

	/**
	 * Получить пространство имен по его полному имени.
	 * @param {string} name
	 * @returns {Namespace | undefined}
	 */
	get(name: string): Namespace | undefined {
		return this.namespaces.find(namespace => namespace.text === name);
	}

	/**
	 * Поиск класса по всем пространствам имен.
	 * @param {string} name
	 */
	find(name: string): Class | undefined {
		return (
			this.namespaces.reduce<Class>(
				(foundClass, namespace) => foundClass ? foundClass : namespace.get(name),
				undefined
			)
		);
	}

	/**
	 * Реализация итератора для менеджера пространств имен.
	 * @returns {IterableIterator<Namespace>}
	 */
	*[Symbol.iterator](): IterableIterator<Namespace> {
		for (let ns of this.namespaces) yield ns;
	}
}