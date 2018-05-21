import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Ext } from '../index';

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



	describe('Пересечения пространств имен', function() {
		it('Добавление одинаковых пространств имен', function() {
			const manager = new Ext.Manager();
			const sampleNamespace1 = new Ext.Namespace('SampleNamespace1');
			// При добавлении одинаковых пространств имен ожидается генерация исключения.
			assert.throw(function() {
				manager.add(sampleNamespace1).add(sampleNamespace1);
			}, Error, `Пространство имен 'SampleNamespace1' уже присутствует в менеджере.`);
		});
		/**
		 * На данный момент пересекающиеся пространства имен не поддерживаются,
		 * хотя теоретически это возможно сделать.
		 */
		it('Добавление пересекающихся пространств имен', function() {
			const manager = new Ext.Manager();
			const sampleNamespace1 = new Ext.Namespace('SampleNamespace1');
			const sampleNamespace12 = new Ext.Namespace('SampleNamespace1.path1');
			// При добавлении пересекающихся пространств имен ожидается генерация исключения.
			assert.throw(function() {
				manager.add(sampleNamespace1).add(sampleNamespace12);
			}, Error, `Пространство имен 'SampleNamespace1.path1' пересекается с 'SampleNamespace1'.`);
		});
	});






	it('Поиск класса в менеджере', function() {
		const manager = new Ext.Manager();
		manager.add(new Ext.Namespace('SampleNamespace1'));
		manager.get('SampleNamespace1').add(new Ext.Class('SampleNamespace1.path1.ClassName'));
		const sampleClass = manager.find('SampleNamespace1.path1.ClassName');
		assert.isDefined<Ext.Class>(sampleClass, 'Ожидается, что класс будет найден');
		assert.strictEqual<string>(sampleClass.name, 'SampleNamespace1.path1.ClassName');
	});
});