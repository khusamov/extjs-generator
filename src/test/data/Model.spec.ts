import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as Ext from '../../index';

describe('Ext.data.Model', function() {
	it('Создание пустого класса Ext.data.Model', function() {
		const class1 = new Ext.data.Model('Namespace1.ClassModel1');
		assert.strictEqual<string>(class1.name, 'Namespace1.ClassModel1');
		assert.strictEqual<string>(class1.extend, 'Ext.data.Model');
	});
	it('Добавление прокси', function() {
		const proxy = {
			serviceMethod: 'getPaymentsHistoryByDebtor',
			reader: {
				rootProperty: 'result.ResultItems',
				typeProperty: function(rawNode) {
					const namespace = "Pir.server.model.baseModel.type";
					return "type" in rawNode ? namespace + ".T" + rawNode.type : undefined;
				}
			}
		};
		const class1 = new Ext.data.Model('Namespace1.ClassModel1');
		class1.proxy = new Ext.data.proxy.ProxyNode(proxy);
		assert.deepEqual<object>(class1.proxy.value, proxy);
	});
});