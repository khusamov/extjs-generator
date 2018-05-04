import Class from './Class';
import Manager from './Manager';

export default class Namespace {
	private classes: Class[] = [];
	constructor(public name: string, public manager?: Manager) {
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