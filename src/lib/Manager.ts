import Namespace from './Namespace';

export default class Manager {
	private namespaces: Namespace[] = [];
	get count(): number {
		return this.namespaces.length;
	}
	add(namespace: Namespace): this {
		const existsNamespace: boolean = !!this.get(namespace.text);
		if (!existsNamespace) {
			namespace.manager = this;
			this.namespaces.push(namespace);
		}
		return this;
	}
	get(name: string): Namespace | undefined {
		return this.namespaces.find(namespace => namespace.text === name);
	}
}