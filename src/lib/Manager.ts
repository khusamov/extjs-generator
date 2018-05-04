import Namespace from './Namespace';

export default class Manager {
	private namespaces: Namespace[] = [];
	get count(): number {
		return this.namespaces.length;
	}
	add(namespace: Namespace): this {
		const existsNamespace: boolean = !!this.get(namespace.name);
		if (!existsNamespace) {
			namespace.manager = this;
			this.namespaces.push(namespace);
		}
		return this;
	}
	get(name: string): Namespace {
		return this.namespaces.find(namespace => namespace.name === name);
	}
}