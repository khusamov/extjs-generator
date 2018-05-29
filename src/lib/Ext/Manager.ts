import Namespace from './Namespace';
import Class from './Class';

/**
 * Менеджер пространств имен и классов.
 */
export default class Manager {
	private namespaces: Namespace[] = [];

	/**
	 * Список всех классов под управлением менеджера.
	 * @returns {Class[]}
	 */
	get classes(): Class[] {
		return [...this].reduce<Class[]>((result, ns: Namespace) => result.concat([...ns]), []);
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

	/**
	 * Отфильтровать пространства имен в новый менеджер.
	 * @param {Function} filterFn
	 * @param {Namespace} filterFn.namespace
	 * @returns {Manager}
	 */
	filter(filterFn: (namespace: Namespace, index: number, namespaces: Namespace[]) => boolean): Manager {
		return (
			this.namespaces
				.filter(filterFn)
				.reduce<Manager>((filteredManager, ns) => filteredManager.add(ns), new Manager())
		);
	}

	map(filterFn: (namespace: Namespace, index: number, namespaces: Namespace[]) => Namespace): Manager {
		return (
			this.namespaces
				.map<Namespace>(filterFn)
				.reduce<Manager>((filteredManager, ns) => filteredManager.add(ns), new Manager())
		);
	}
}