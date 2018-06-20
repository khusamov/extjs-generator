import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Manager, Namespace, BaseClass } from '../../index';

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
	it('Менеджер как итератор по пространствам имен', function() {
		const manager = new Manager();
		manager
			.add(new Namespace('SampleNamespace1'))
			.add(new Namespace('SampleNamespace2'))
			.add(new Namespace('SampleNamespace3'));
		// Цикл по итератору.
		for (let namespace of manager) {
			assert.instanceOf<Namespace>(namespace, Namespace);
		}
		// Оператор ... для итератора.
		assert.deepEqual(
			[...manager].map(ns => ns.name),
			[
				'SampleNamespace1',
				'SampleNamespace2',
				'SampleNamespace3'
			]
		);
	});



	describe('Пересечения пространств имен', function() {
		it('Добавление одинаковых пространств имен', function() {
			const manager = new Manager();
			const sampleNamespace1 = new Namespace('SampleNamespace1');
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
			const manager = new Manager();
			const sampleNamespace1 = new Namespace('SampleNamespace1');
			const sampleNamespace12 = new Namespace('SampleNamespace1.path1');
			// При добавлении пересекающихся пространств имен ожидается генерация исключения.
			assert.throw(function() {
				manager.add(sampleNamespace1).add(sampleNamespace12);
			}, Error, `Пространство имен 'SampleNamespace1.path1' пересекается с 'SampleNamespace1'.`);
		});
	});






	it('Поиск класса в менеджере', function() {
		const manager = new Manager();
		manager.add(new Namespace('SampleNamespace1'));
		manager.get('SampleNamespace1').add(new BaseClass('SampleNamespace1.path1.ClassName'));
		const sampleClass = manager.findClass('SampleNamespace1.path1.ClassName');
		assert.isDefined<BaseClass>(sampleClass, 'Ожидается, что класс будет найден');
		assert.strictEqual<string>(sampleClass.name, 'SampleNamespace1.path1.ClassName');
	});
	it('Список классов', function() {
		const manager1 = new Manager();
		const namespace1 = new Namespace('Namespace1', manager1);
		const classList = ['Namespace1.Class1', 'Namespace1.path1.ClassName', 'Namespace1.path1.path2.path3.ClassName'];
		for (let className of classList) namespace1.add(new BaseClass(className));
		assert.deepEqual<string[]>(manager1.classes.map(cls => cls.name), classList);
	});
	// it('Конвертация массива пространств имен менеджера методом map()', function() {
	// 	const manager1 = new Manager();
	// 	manager1.add(new Namespace('Namespace1'));
	// 	manager1.add(new Namespace('Namespace2'));
	// 	manager1.add(new Namespace('Namespace3'));
	// 	assert.deepEqual([...manager1].map(ns => ns.name), ['Namespace1', 'Namespace2', 'Namespace3']);
	// });
	// it('Фильтрация менеджера методом filter()', function() {
	// 	const manager1 = new Manager();
	// 	manager1.add(new Namespace('Namespace1'));
	// 	manager1.add(new Namespace('Namespace2'));
	// 	manager1.add(new Namespace('Namespace3'));
	// 	const filteredManager1 = manager1.filter(ns => ns.name === 'Namespace1' || ns.name === 'Namespace3');
	// 	assert.strictEqual<number>(filteredManager1.count, 2);
	// 	assert.deepEqual([...filteredManager1].map(ns => ns.name), ['Namespace1', 'Namespace3']);
	// });
	it('Менеджер пространств имен со списком на входе конструктора', function() {
		const manager1 = new Manager('Namespace1', 'Namespace2', 'Namespace3', 'Namespace4');
		assert.deepEqual([...manager1].map(ns => ns.name), ['Namespace1', 'Namespace2', 'Namespace3', 'Namespace4']);
	});
});