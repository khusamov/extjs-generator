import Class from './Class';
import Manager from './Manager';

/**
 * Пространство имен.
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
	 * @returns {this}
	 */
	add(cls: Class): this {
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
}