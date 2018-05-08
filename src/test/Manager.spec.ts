import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as Ext from '../index';

describe('Manager', function() {
	it('Пустой менеджер пространств имен', function() {
		const manager = new Ext.Manager();
		assert.ok<Ext.Manager>(manager);
		assert.strictEqual<number>(manager.count, 0);
	});
	it('Получить несуществующее пространство имен', function() {
		const manager = new Ext.Manager();
		assert.isUndefined(manager.get('SampleNamespace1'));
	});
	it('Получить пространство имен по имени', function() {
		const manager = new Ext.Manager();
		const sampleNamespace1 = new Ext.Namespace('SampleNamespace1', manager);
		assert.strictEqual<Ext.Namespace>(manager.get('SampleNamespace1'), sampleNamespace1);
	});
	it('Добавление двух пространств имен', function() {
		const manager = new Ext.Manager();
		const sampleNamespace1 = new Ext.Namespace('SampleNamespace1');
		const sampleNamespace2 = new Ext.Namespace('SampleNamespace2');
		manager
			.add(sampleNamespace1)
			.add(sampleNamespace2);
		assert.strictEqual<number>(manager.count, 2);
		assert.strictEqual<Ext.Namespace>(manager.get('SampleNamespace1'), sampleNamespace1);
		assert.strictEqual<Ext.Namespace>(manager.get('SampleNamespace2'), sampleNamespace2);
	});
	it('Добавление одинаковых пространств имен', function() {
		const manager = new Ext.Manager();
		const sampleNamespace1 = new Ext.Namespace('SampleNamespace1');
		manager.add(sampleNamespace1).add(sampleNamespace1);
		assert.strictEqual<number>(manager.count, 1, 'Было добавлено одно пространство имен');
	});
});