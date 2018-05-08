import {ObjectNode} from 'khusamov-javascript-generator';
import Namespace from './Namespace';
import ClassName from './ClassName';

export default class Class extends ObjectNode {
	constructor(
		name: string,
		public namespace?: Namespace | undefined,
		private config?: any | undefined
	) {
		super(name);
		if (!ClassName.isValid(name)) throw new Error(`Имя класса '${name}' ошибочное.`);
		if (namespace) {
			// Проверка, входит ли класс в данное пространство или нет.
			if (name.indexOf(namespace.text) !== 0) {
				throw new Error(`Класс '${name}' не входит в пространство имен '${namespace.text}'.`);
			}
			namespace.add(this);
		}
	}
}