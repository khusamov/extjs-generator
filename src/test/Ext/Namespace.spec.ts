import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Manager, Namespace, BaseClass } from '../../index';

describe('Namespace', function() {
	it('Проверка имени пространства имен на валидность', function() {
		assert.isTrue(Namespace.isValid('Namespace'));
		assert.isTrue(Namespace.isValid('NamespaceNamespace'));
		assert.isTrue(Namespace.isValid('NamespaceNamespaceNamespace'));
		assert.isTrue(Namespace.isValid('Namespace321321'));
		assert.isFalse(Namespace.isValid('Name space'));
		assert.isFalse(Namespace.isValid('namespace'));
		assert.isFalse(Namespace.isValid('Namespace_'));
		assert.isFalse(Namespace.isValid('Namespace_Namespace'));
		assert.isFalse(Namespace.isValid('Namespace.path1.path2'));
		assert.isFalse(Namespace.isValid(' Namespace. path1.path2'));
	});

	it('Создание пустого пространства имен', function() {
		const manager = new Manager();
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.ok<Namespace>(sampleNamespace);
		assert.strictEqual<number>(sampleNamespace.count, 0);
	});
	it('Проверка имени пространства имен', function() {
		const manager = new Manager();
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.name, 'SampleNamespace');
	});
	it('Проверка менеджера пространства имен', function() {
		const manager = new Manager();
		const sampleNamespace = new Namespace('SampleNamespace', manager);
		assert.strictEqual(sampleNamespace.manager, manager);
	});
	it('Пространство имен как итератор по классам', function() {
		const namespace1 = new Namespace('Namespace1');
		namespace1
			.add(new BaseClass('Namespace1.Class1'))
			.add(new BaseClass('Namespace1.Class2'))
			.add(new BaseClass('Namespace1.Class3'));
		// Цикл по итератору.
		for (let cls of namespace1) {
			assert.instanceOf<BaseClass>(cls, BaseClass);
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