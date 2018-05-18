import {ObjectNode} from 'khusamov-javascript-generator';

export default class ProxyNode extends ObjectNode {
	constructor(value?: any) {
		super('proxy', value);
	}
}