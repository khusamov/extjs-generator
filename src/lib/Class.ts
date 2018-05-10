import {ObjectNode} from 'khusamov-javascript-generator';
import Namespace from './Namespace';
import ClassName from './ClassName';

export default class Class extends ObjectNode {
	private config: any = {};
	namespace: Namespace | undefined;
	constructor(
		name: string,
		namespaceOrConfig?: Namespace | any | undefined,
		config: any = {}
	) {
		super(name);

		if (!ClassName.isValid(name)) throw new Error(`Имя класса '${name}' ошибочное.`);

		if (arguments.length === 2) {
			if (namespaceOrConfig instanceof Namespace) {
				this.namespace = namespaceOrConfig;
			} else {
				this.config = namespaceOrConfig;
			}
		}

		if (arguments.length === 3) {
			if (!(namespaceOrConfig instanceof Namespace)) {
				throw new Error(`Если указаны три аргумента, то аргумент namespaceOrConfig должен быть экземпляром класса Namespace.`);
			}
			this.namespace = namespaceOrConfig;
			this.config = config;
		}

		if (this.namespace) {
			// Проверка, входит ли класс в данное пространство или нет.
			if (name.indexOf(this.namespace.text) !== 0) {
				throw new Error(`Класс '${name}' не входит в пространство имен '${this.namespace.text}'.`);
			}
			this.namespace.add(this);
		}
	}
}