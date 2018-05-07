import * as _ from 'lodash';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import Manager from '../lib/Manager';
import Namespace from '../lib/Namespace';

describe('Manager', function() {
	it('Пустой менеджер пространств имен', function() {
		const manager = new Manager();
		assert.ok<Manager>(manager);
		assert.strictEqual<number>(manager.count, 0);
	});
	it('Получить несуществующее пространство имен', function() {
		const manager = new Manager();
		assert.isUndefined(manager.get('SampleNamespace1'));
	});
	it('Получить пространство имен по имени', function() {
		const manager = new Manager();
		const sampleNamespace1 = new Namespace('SampleNamespace1', manager);
		assert.strictEqual<Namespace>(manager.get('SampleNamespace1'), sampleNamespace1);
	});
	it('Добавление двух пространств имен', function() {
		const manager = new Manager();
		const sampleNamespace1 = new Namespace('SampleNamespace1');
		const sampleNamespace2 = new Namespace('SampleNamespace2');
		manager
			.add(sampleNamespace1)
			.add(sampleNamespace2);
		assert.strictEqual<number>(manager.count, 2);
		assert.strictEqual<Namespace>(manager.get('SampleNamespace1'), sampleNamespace1);
		assert.strictEqual<Namespace>(manager.get('SampleNamespace2'), sampleNamespace2);
	});
	it('Добавление одинаковых пространств имен', function() {
		const manager = new Manager();
		const sampleNamespace1 = new Namespace('SampleNamespace1');
		manager.add(sampleNamespace1).add(sampleNamespace1);
		assert.strictEqual<number>(manager.count, 1, 'Было добавлено одно пространство имен');
	});
});