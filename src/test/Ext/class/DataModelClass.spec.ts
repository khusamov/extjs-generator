import { describe, it } from 'mocha';
import { assert } from 'chai';
import { BaseClass, DataModelClass } from '../../../index';

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
			hasOne: [],
			hasMany: [],
			proxy: {},
			fields: [{
				'mapping': 'data.Field1',
				'name': 'field1'
			}]
		});
	});
	/**
	 * Данный тест добавлен только для исключения ситуации, когда создаем один класс,
	 * а потом второй, то данные из первого класса каким-то образом попадают во второй.
	 */
	it('Данные предыдущих классов не должны появляться в последующих', function() {
		const class1 = new BaseClass('Namespace1.path1.Class1');
		class1.alias = ['widget.class1', 'widget.class1v2', 'widget.class1v3'];
		const dataModelClass1 = new DataModelClass('Namespace1.DataModelClass1');
		assert.deepEqual<object>(dataModelClass1.value, {
			alias: undefined,
			extend: 'Ext.data.Model',
			fields: [],
			override: undefined,
			hasOne: [],
			hasMany: [],
			proxy: {},
			requires: [],
			uses: [],
			xtype: undefined
		});
	});
});