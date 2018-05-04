import * as _ from 'lodash';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import Namespace from '../lib/Namespace';
import Manager from '../lib/Manager';

describe('Namespace', function() {
	const manager = new Manager();
	it('create', function() {
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.ok<Namespace>(sampleNamespace);
	});
	it('name', function() {
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.name, 'SampleNamespace');
	});
	it('manager', function() {
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.manager, manager);
	});
});