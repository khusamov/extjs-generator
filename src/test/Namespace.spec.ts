import * as _ from 'lodash';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import Namespace from '../lib/Namespace';
import Manager from '../lib/Manager';
import ClassName from '../lib/ClassName';

describe('Namespace', function() {
	it('Проверка пространства имен на валидность', function() {
		assert.isTrue(Namespace.isValid('Namespace'));
		assert.isTrue(Namespace.isValid('NamespaceNamespace'));
		assert.isTrue(Namespace.isValid('NamespaceNamespaceNamespace'));
		assert.isTrue(Namespace.isValid('Namespace321321'));
		assert.isFalse(Namespace.isValid('namespace'));
		assert.isFalse(Namespace.isValid('Namespace_'));
		assert.isFalse(Namespace.isValid('Namespace_Namespace'));
	});

	const manager = new Manager();
	it('create', function() {
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.ok<Namespace>(sampleNamespace);
	});
	it('name', function() {
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.text, 'SampleNamespace');
	});
	it('manager', function() {
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.manager, manager);
	});
});