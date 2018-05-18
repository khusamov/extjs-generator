import * as _ from 'lodash';
//import { ObjectNode, StringNode } from 'khusamov-javascript-generator';
import Class from '../Class';
import ProxyNode from './proxy/ProxyNode';

/**
 * Имитация класса Ext.data.Model.
 * @link http://docs.sencha.com/extjs/6.5.3/classic/Ext.data.Model.html
 */
export default class Model extends Class {
	get proxy(): ProxyNode | undefined {
		return this.has('proxy') ? this.get<ProxyNode>('proxy') : undefined;
	}
	set proxy(proxy: ProxyNode | undefined) {
		if (_.isNil(proxy)) {
			// Когда узел proxy не определен, то в выходном коде его не должно быть, поэтому удаляем.
			// Иными словами следующие варианты исключаем: proxy: null, proxy: undefined.
			this.remove(this.get('proxy'));
		} else {
			this.add('proxy', proxy);
		}
	}
	initClass() {
		if (!this.extend) this.extend = 'Ext.data.Model';
	}
}