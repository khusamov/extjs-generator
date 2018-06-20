import Namespace from './Namespace';
import BaseClass from './class/BaseClass';

/**
 * Менеджер пространств имен и классов.
 */
export default class Manager {
	private namespaces: Namespace[] = [];

	/**
	 * Список всех классов под управлением менеджера.
	 * @returns {BaseClass[]}
	 */
	get classes(): BaseClass[] {
		return [...this].reduce<BaseClass[]>((result, ns: Namespace) => result.concat([...ns]), []);
	}

	/**
	 * Количество пространств имен под управлением менеджера.
	 * @returns {number}
	 */
	get count(): number {
		return this.namespaces.length;
	}

	/**
	 * Конструктор менеджера.
	 * На вход можно подать список пространств имен, которые будут добавлены в менеджер.
	 * @param {string | Namespace} namespaces
	 */
	constructor(...namespaces: (string | Namespace)[]) {
		for (let namespace of namespaces.map(ns => ns instanceof Namespace ? ns : new Namespace(ns))) {
			this.add(namespace);
		}
	}

	/**
	 * Добавить пространство имен.
	 * Пространство не должно присутствовать в менеджере или пересекаться с имеющимися.
	 * @param {string | Namespace} nameOrNamespace
	 * @returns {Manager}
	 */
	add(nameOrNamespace: string | Namespace): this {
		const namespace: Namespace = (
			nameOrNamespace instanceof Namespace
				? nameOrNamespace :
				new Namespace(nameOrNamespace)
		);

		if (this.has(namespace.name)) {
			throw new Error(`Пространство имен '${namespace.name}' уже присутствует в менеджере.`);
		}

		const intersectedNamespace = this.namespaces.find(testedNamespace => (
			testedNamespace.name.indexOf(namespace.name) === 0
			|| namespace.name.indexOf(testedNamespace.name) === 0
		));
		if (intersectedNamespace) {
			throw new Error(`Пространство имен '${namespace.name}' пересекается с '${intersectedNamespace.name}'.`);
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
	findClass(name: string): BaseClass | undefined {
		return (
			this.namespaces.reduce<BaseClass>(
				(foundClass, namespace) => foundClass ? foundClass : namespace.get(name),
				undefined
			)
		);
	}

	has(name: string): boolean {
		return !!this.get(name);
	}

	/**
	 * Реализация итератора для менеджера пространств имен.
	 * @returns {IterableIterator<Namespace>}
	 */
	*[Symbol.iterator](): IterableIterator<Namespace> {
		for (let ns of this.namespaces) yield ns;
	}

	// /**
	//  * Отфильтровать пространства имен в новый менеджер.
	//  * @param {Function} filterFn
	//  * @param {Namespace} filterFn.namespace
	//  * @returns {Manager}
	//  */
	// filter(filterFn: (namespace: Namespace, index: number, namespaces: Namespace[]) => boolean): Manager {
	// 	return (
	// 		this.namespaces
	// 			.filter(filterFn)
	// 			.reduce<Manager>((filteredManager, ns) => filteredManager.add(ns), new Manager())
	// 	);
	// }
	//
	// map(filterFn: (namespace: Namespace, index: number, namespaces: Namespace[]) => Namespace): Manager {
	// 	return (
	// 		this.namespaces
	// 			.map<Namespace>(filterFn)
	// 			.reduce<Manager>((filteredManager, ns) => filteredManager.add(ns), new Manager())
	// 	);
	// }
}