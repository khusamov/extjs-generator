import { ArrayNode, ObjectNode } from 'khusamov-javascript-generator';
import BaseClass from '../class/BaseClass';

/**
 * Имитация класса Ext.data.Model.
 * @link http://docs.sencha.com/extjs/6.5.3/classic/Ext.data.Model.html
 */
export default class DataModelClass extends BaseClass {
	proxy: ObjectNode = new ObjectNode('proxy');
	fields: ArrayNode = new ArrayNode('fields');
	initClass() {
		if (!this.extend) this.extend = 'Ext.data.Model';
	}
}