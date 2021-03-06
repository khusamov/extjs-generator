import { ArrayNode, ObjectNode } from 'khusamov-javascript-generator';
import BaseClass from '../class/BaseClass';

/**
 * Имитация класса Ext.data.Model.
 * @link http://docs.sencha.com/extjs/6.5.3/classic/Ext.data.Model.html
 */
export default class DataModelClass extends BaseClass {
	proxy: ObjectNode;
	fields: ArrayNode;
	hasOne: ArrayNode;
	hasMany: ArrayNode;
	initClass() {
		if (!this.extend) this.extend = 'Ext.data.Model';
		this.proxy = new ObjectNode('proxy');
		this.fields = new ArrayNode('fields');
		this.hasOne = new ArrayNode('hasOne');
		this.hasMany = new ArrayNode('hasMany');
		this.add({
			proxy: this.proxy,
			fields: this.fields,
			hasOne: this.hasOne,
			hasMany: this.hasMany
		});
	}
}