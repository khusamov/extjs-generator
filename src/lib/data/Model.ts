import * as _ from 'lodash';
//import { ObjectNode, StringNode } from 'khusamov-javascript-generator';
import Class from '../Class';
import ProxyNode from './proxy/ProxyNode';

/**
 * Имитация класса Ext.data.Model.
 * @link http://docs.sencha.com/extjs/6.5.3/classic/Ext.data.Model.html
 */
export default class Model extends Class {
	proxy: ProxyNode = new ProxyNode();
	initClass() {
		if (!this.extend) this.extend = 'Ext.data.Model';
	}
}