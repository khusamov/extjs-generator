import Class from './Class';
import Manager from './Manager';

export default class Namespace {
	static isValid(name: string): boolean {
		const nameRe = /^[A-Z]+([A-Z]?[a-z0-9]+)+$/;
		return nameRe.test(name);
	}
	private classes: Class[] = [];
	constructor(public text: string, public manager?: Manager) {
		if (manager) manager.add(this);
	}
	add(cls: Class): this {
		cls.namespace = this;
		this.classes.push(cls);
		return this;
	}
	get(name: string): Class {
		return this.classes.find(cls => cls.name === name);
	}
}