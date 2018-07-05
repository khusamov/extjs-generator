import { describe, it } from 'mocha';
import { assert } from 'chai';
import { DataModelClass } from '../../../index';

describe('DataModelClass', function() {
	it('Создание пустого класса DataModelClass', function() {
		const class1 = new DataModelClass('Namespace1.ClassModel1');
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
		const class1 = new DataModelClass('Namespace1.ClassModel1');
		class1.proxy.set(proxy);
		assert.deepEqual<object>(class1.proxy.value, proxy);
	});
	it('Добавление полей модели', function() {
		const class1 = new DataModelClass('Namespace1.ClassModel1');
		class1.fields.add({
			name: 'field1',
			mapping: 'data.Field1'
		});
		assert.deepEqual<object>(class1.fields.value, [{
			name: 'field1',
			mapping: 'data.Field1'
		}]);
		assert.deepEqual<object>(class1.value, {
			extend: 'Ext.data.Model',
			override: undefined,
			alias: undefined,
			xtype: undefined,
			requires: [],
			uses: [],
			proxy: {},
			fields: [{
				'mapping': 'data.Field1',
				'name': 'field1'
			}]
		});
	});
});