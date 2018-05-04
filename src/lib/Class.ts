import {ObjectNode} from 'khusamov-javascript-generator';
import Namespace from './Namespace';

export default class Class extends ObjectNode {
	constructor(name: string, public namespace?: Namespace, public config?: any) {
		super(name);
		if (namespace) namespace.add(this);
	}
}