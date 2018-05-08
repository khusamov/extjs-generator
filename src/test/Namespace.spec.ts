import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as Ext from '../index';

describe('Namespace', function() {
	it('Проверка пространства имен на валидность', function() {
		assert.isTrue(Ext.Namespace.isValid('Namespace'));
		assert.isTrue(Ext.Namespace.isValid('NamespaceNamespace'));
		assert.isTrue(Ext.Namespace.isValid('NamespaceNamespaceNamespace'));
		assert.isTrue(Ext.Namespace.isValid('Namespace321321'));
		assert.isFalse(Ext.Namespace.isValid('namespace'));
		assert.isFalse(Ext.Namespace.isValid('Namespace_'));
		assert.isFalse(Ext.Namespace.isValid('Namespace_Namespace'));
	});

	const manager = new Ext.Manager();
	it('create', function() {
		const sampleNamespace = new Ext.Namespace('SampleNamespace', manager);
		assert.ok<Ext.Namespace>(sampleNamespace);
	});
	it('name', function() {
		const sampleNamespace = new Ext.Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.text, 'SampleNamespace');
	});
	it('manager', function() {
		const sampleNamespace = new Ext.Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.manager, manager);
	});
});