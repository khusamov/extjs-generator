import { describe, it } from 'mocha';
import { assert } from 'chai';
import {  } from '../../index';

describe('Namespace', function() {
	it('Проверка имени пространства имен на валидность', function() {
		assert.isTrue(Ext.Namespace.isValid('Namespace'));
		assert.isTrue(Ext.Namespace.isValid('NamespaceNamespace'));
		assert.isTrue(Ext.Namespace.isValid('NamespaceNamespaceNamespace'));
		assert.isTrue(Ext.Namespace.isValid('Namespace321321'));
		assert.isFalse(Ext.Namespace.isValid('Name space'));
		assert.isFalse(Ext.Namespace.isValid('namespace'));
		assert.isFalse(Ext.Namespace.isValid('Namespace_'));
		assert.isFalse(Ext.Namespace.isValid('Namespace_Namespace'));
		assert.isFalse(Ext.Namespace.isValid('Namespace.path1.path2'));
		assert.isFalse(Ext.Namespace.isValid(' Namespace. path1.path2'));
	});

	it('Создание пустого пространства имен', function() {
		const manager = new Ext.Manager();
		const sampleNamespace = new Ext.Namespace('SampleNamespace', manager);
		assert.ok<Ext.Namespace>(sampleNamespace);
		assert.strictEqual<number>(sampleNamespace.count, 0);
	});
	it('Проверка имени пространства имен', function() {
		const manager = new Ext.Manager();
		const sampleNamespace = new Ext.Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.name, 'SampleNamespace');
	});
	it('Проверка менеджера пространства имен', function() {
		const manager = new Ext.Manager();
		const sampleNamespace = new Ext.Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.manager, manager);
	});
	it('Пространство имен как итератор по классам', function() {
		const namespace1 = new Ext.Namespace('Namespace1');
		namespace1
			.add(new Ext.BaseClass('Namespace1.Class1'))
			.add(new Ext.BaseClass('Namespace1.Class2'))
			.add(new Ext.BaseClass('Namespace1.Class3'));
		// Цикл по итератору.
		for (let cls of namespace1) {
			assert.instanceOf<Ext.BaseClass>(cls, Ext.BaseClass);
		}
		// Оператор ... для итератора.
		assert.deepEqual(
			[...namespace1].map(cls => cls.name),
			[
				'Namespace1.Class1',
				'Namespace1.Class2',
				'Namespace1.Class3'
			]
		);
	});
});