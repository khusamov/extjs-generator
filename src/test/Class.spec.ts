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
	});
});