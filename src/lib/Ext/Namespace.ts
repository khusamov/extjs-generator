import Class from './Class';
import Manager from './Manager';

/**
 * Пространство имен.
 * Пространство имен из себя представляет менеджер классов.
 */
export default class Namespace {
	/**
	 * Проверка валидности имени пространства имен.
	 * @param {string} name
	 * @returns {boolean}
	 */
	static isValid(name: string): boolean {
		const nameRe = /^[A-Z]+([A-Z]?[a-z0-9]+)+$/;
		return nameRe.test(name);
	}

	private classes: Class[] = [];

	/**
	 * Количество классов в данном пространстве имен.
	 * @returns {number}
	 */
	get count(): number {
		return this.classes.length;
	}

	get hasClasses(): boolean {
		return !!this.count;
	}

	get name(): string {
		return this.text;
	}

	/**
	 * Конструктор.
	 * @param {string} text
	 * @param {Manager} manager
	 */
	constructor(public text: string, public manager?: Manager) {
		if (manager) manager.add(this);
	}

	/**
	 * Добавить класс в пространство имен.
	 * @param {Class} cls
	 * @returns {Namespace}
	 */
	add(cls: Class): this {
		const namespaceHasClass = !!this.classes.find(testedClass => testedClass === cls);
		if (namespaceHasClass) {
			throw new Error(`Попытка дважды добавить класс '${cls.name}' в пространство имен '${this.name}'.`);
		}
		const namespaceHasClassByName = !!this.classes.find(testedClass => testedClass.name === cls.name);
		if (namespaceHasClassByName) {
			throw new Error(`В пространстве имен '${this.name}' уже имеется класс с именем '${cls.name}'.`);
		}
		if (cls.namespace && cls.namespace !== this) {
			throw new Error(`Попытка добавить в пространство имен '${this.name}' класс '${cls.name}' из пространства имен '${cls.namespace.name}'.`);
		}
		if (cls.name.indexOf(this.text) !== 0) {
			throw new Error(`Класс '${cls.name}' не входит в пространство имен '${this.name}'.`);
		}
		cls.namespace = this;
		this.classes.push(cls);
		return this;
	}

	/**
	 * Получить класс по его полному имени.
	 * @param {string} name
	 * @returns {Class}
	 */
	get(name: string): Class {
		return this.classes.find(cls => cls.name === name);
	}

	/**
	 * Реализация итератора для пространства имен.
	 * @returns {IterableIterator<Namespace>}
	 */
	*[Symbol.iterator](): IterableIterator<Class> {
		for (let ns of this.classes) yield ns;
	}

	// /**
	//  * Отфильтровать классы в новое пространство имен с тем же именем и менеджером.
	//  * @param {Function} filterFn
	//  * @returns {Namespace}
	//  */
	// filter(filterFn: (cls: Class, index: number, classes: Class[]) => boolean): Namespace {
	// 	return (
	// 		this.classes
	// 			.filter(filterFn)
	// 			.reduce<Namespace>(
	// 				(filteredManager, ns) => filteredManager.add(ns),
	// 				new Namespace(this.name, this.manager)
	// 			)
	// 	);
	// }
}