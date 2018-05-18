import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as Ext from '../index';

describe('Class', function() {

	describe('Создание класса', function() {
		it('Создание пустого класса, не привязанного к пространству имен', function() {
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			assert.ok<Ext.Class>(class1);
		});
		it('Создание класса с привязкой к пространству имен', function() {
			const manager = new Ext.Manager();
			const namespace1 = new Ext.Namespace('Namespace1', manager);
			const class1 = new Ext.Class('Namespace1.path1.Class1', namespace1);
			assert.strictEqual<Ext.Class>(manager.find('Namespace1.path1.Class1'), class1);
			assert.strictEqual<Ext.Class>(namespace1.get('Namespace1.path1.Class1'), class1);
		});
		it('Создание класса с добавлением в пространство имен', function() {
			const manager = new Ext.Manager();
			const namespace1 = new Ext.Namespace('Namespace1', manager);
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			namespace1.add(class1);
			assert.strictEqual<Ext.Class>(manager.find('Namespace1.path1.Class1'), class1);
			assert.strictEqual<Ext.Class>(namespace1.get('Namespace1.path1.Class1'), class1);
		});
	});

	describe('Генерация исключений при создании класса', function() {
		it('Создание класса с неправильным пространством имен', function() {
			const manager = new Ext.Manager();
			const namespace1 = new Ext.Namespace('Namespace1', manager);
			assert.throw(function() {
				new Ext.Class('Namespace2.path1.Class1', namespace1);
			}, `Класс 'Namespace2.path1.Class1' не входит в пространство имен 'Namespace1'.`);
			assert.throw(function() {
				const class2 = new Ext.Class('Namespace2.path1.Class2');
				namespace1.add(class2);
			}, `Класс 'Namespace2.path1.Class2' не входит в пространство имен 'Namespace1'.`);
		});
		it('Попытка дважды добавить один и тот же класс в пространство имен', function() {
			const manager = new Ext.Manager();
			const namespace1 = new Ext.Namespace('Namespace1', manager);
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			namespace1.add(class1);
			assert.throw(function() {
				namespace1.add(class1);
			}, `Попытка дважды добавить класс 'Namespace1.path1.Class1' в пространство имен 'Namespace1'.`);
		});
		it('Попытка добавить класс в пространство имен из другого пространства', function() {
			const manager = new Ext.Manager();
			const namespace1 = new Ext.Namespace('Namespace1', manager);
			const namespace2 = new Ext.Namespace('Namespace2', manager);
			const class1 = new Ext.Class('Namespace1.path1.Class1', namespace1);
			assert.throw(function() {
				namespace2.add(class1);
			}, `Попытка добавить в пространство имен 'Namespace2' класс 'Namespace1.path1.Class1' из пространства имен 'Namespace1'.`);
		});
		it('Попытка вместо пространства имен добавить дату', function() {
			assert.throw(function() {
				new Ext.Class('Namespace1.path1.Class1', new Date, {});
			}, `Если указаны три аргумента, то аргумент namespaceOrConfig должен быть экземпляром класса Namespace.`);
		});
	});

	describe('Основные поля класса', function() {
		it('Добавление в extend', function() {
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			class1.extend = 'Ext.panel.Panel';
			assert.strictEqual<string>(class1.extend, 'Ext.panel.Panel');
		});
		it('Очистка extend', function() {
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			class1.extend = 'Ext.panel.Panel';
			class1.extend = undefined;
			assert.isUndefined(class1.extend);
		});
		it('Создание extend через конструктор класса', function() {
			const class1 = new Ext.Class('Namespace1.path1.Class1', {
				extend: 'Ext.data.Model'
			});
			assert.strictEqual<string>(class1.extend, 'Ext.data.Model');
		});
		it('Добавление классов в requires', function() {
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			class1.requires.add('Class1', 'Class2', 'Namespace2.sample.Class3');
			assert.deepEqual<string[]>(class1.requires.value, ['Class1', 'Class2', 'Namespace2.sample.Class3']);
		});
		it('Добавление классов в uses', function() {
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			class1.uses.add('Class1', 'Class2', 'Namespace2.sample.Class3');
			assert.deepEqual<string[]>(class1.uses.value, ['Class1', 'Class2', 'Namespace2.sample.Class3']);
		});
		it('Добавление в alias одного псевдонима', function() {
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			class1.alias = 'widget.class1';
			assert.strictEqual<string>(class1.alias, 'widget.class1');
		});
		it('Добавление в alias массив псведонимов', function() {
			const class1 = new Ext.Class('Namespace1.path1.Class1');
			class1.alias = ['widget.class1', 'widget.class1v2', 'widget.class1v3'];
			assert.deepEqual<string[]>(class1.alias, ['widget.class1', 'widget.class1v2', 'widget.class1v3']);
		});
	});

});