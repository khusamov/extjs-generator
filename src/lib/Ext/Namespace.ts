import BaseClass from './class/BaseClass';
import Manager from './Manager';

/**
 * Пространство имен.
 * Пространство имен из себя представляет менеджер классов.
 * Имя пространства имен должно соответствовать PascalCase-формату строк.
 */
export default class Namespace {
	/**
	 * Проверка валидности имени пространства имен.
	 * Имя пространства имен должно соответствовать PascalCase-формату строк.
	 * @param {string} name
	 * @returns {boolean}
	 */
	static isValid(name: string): boolean {
		const nameRe = /^[A-Z]+([A-Z]?[a-z0-9]+)+$/;
		return nameRe.test(name);
	}

	private classes: BaseClass[] = [];

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

	/**
	 * @deprecated
	 * @returns {string}
	 */
	get text(): string {
		console.warn('Свойство Namespace.text устарело. Используйте name.');
		return this.name;
	}

	/**
	 * Конструктор.
	 * @param {string} name
	 * @param {Manager} manager
	 */
	constructor(public name: string, public manager?: Manager) {
		if (manager) manager.add(this);
	}

	/**
	 * Добавить класс в пространство имен.
	 * @param {BaseClass} cls
	 * @returns {Namespace}
	 */
	add(cls: BaseClass): this {
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
	 * @returns {BaseClass}
	 */
	get(name: string): BaseClass {
		return this.classes.find(cls => cls.name === name);
	}

	/**
	 * Реализация итератора для пространства имен.
	 * @returns {IterableIterator<Namespace>}
	 */
	*[Symbol.iterator](): IterableIterator<BaseClass> {
		for (let ns of this.classes) yield ns;
	}
}