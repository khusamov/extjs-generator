import {ObjectNode} from 'khusamov-javascript-generator';
import Namespace from './Namespace';
import ClassName from './ClassName';

export default class Class extends ObjectNode {
	constructor(name: string, public namespace?: Namespace, public config?: any) {
		super(name);
		if (!ClassName.isValid(name)) throw new Error(`Имя класса '${name}' ошибочное.`);
		if (namespace) namespace.add(this);
	}
}