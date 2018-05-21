import Class from '../Class';
import { ArrayNode, ObjectNode } from 'khusamov-javascript-generator';

/**
 * Имитация класса Ext.data.Model.
 * @link http://docs.sencha.com/extjs/6.5.3/classic/Ext.data.Model.html
 */
export default class Model extends Class {
	proxy: ObjectNode = new ObjectNode('proxy');
	fields: ArrayNode = new ArrayNode('fields');
	initClass() {
		if (!this.extend) this.extend = 'Ext.data.Model';
	}
}