import * as _ from 'lodash';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import ClassName, {IClassName} from '../lib/ClassName';
import Namespace from '../lib/Namespace';

describe('ClassName', function() {
	describe('Парсинг имени класса', function() {
		it('Парсинг имени класса без пространства имен', function() {
			const parsed: IClassName = ClassName.parse('Namespace.path1.path2.path3.ClassName');
			assert.strictEqual<string>(parsed.name, 'ClassName');
			assert.deepEqual<string[]>(parsed.path, ['path1', 'path2', 'path3']);
			assert.strictEqual<string>(parsed.namespace as string, 'Namespace');
		});
		it('Парсинг имени класса с определением пространства имен', function() {
			const namespace = 'Namespace.path1';
			const parsed: IClassName = ClassName.parse(namespace + '.path2.path3.ClassName', namespace);
			assert.strictEqual<string>(parsed.name, 'ClassName');
			assert.deepEqual<string[]>(parsed.path, ['path2', 'path3']);
			assert.strictEqual<string>(parsed.namespace as string, namespace);
		});
		it('Имя класса не совпадает с пространством имен', function() {
			const name = 'Namespace.path1.path2.path3.ClassName';
			assert.throw(function() { ClassName.parse(name, 'Namespace2.path6'); });
			assert.doesNotThrow(function() { ClassName.parse(name, 'Namespace.path1'); });
		});
	});
	it('Проверка имени класса на валидность', function() {
		assert.isTrue(ClassName.isValid('Namespace.ClassName'));
		assert.isTrue(ClassName.isValid('Namespace.path1.ClassName'));
		assert.isTrue(ClassName.isValid('Namespace.path1.path2.path3.ClassName'));
		assert.isFalse(ClassName.isValid('namespace.ClassName'));
		assert.isFalse(ClassName.isValid('Namespace.className'));
	});
	it('Получение имени файла, соответствующего имени класса', function() {
		const name = 'Namespace.path1.path2.path3.ClassName';
		const filename = 'path1/path2/path3/ClassName.js';
		const rootPath = 'root/path';
		assert.strictEqual<string>(ClassName.toSourceFileName(name), filename);
		assert.strictEqual<string>(ClassName.toSourceFileName(name, rootPath), [rootPath, filename].join('/'));
	});
	it('Пустое имя', function() {
		const className = new ClassName();
		assert.instanceOf<Namespace>(className.namespace, Namespace);
		assert.strictEqual<string>(className.namespace.text, '', 'Ожидается пустое имя пространства имен');
		assert.isArray<string[]>(className.path, 'Ожидается массив');
		assert.strictEqual<number>(className.path.length, 0, 'Ожидается пустой массив');
		assert.strictEqual<string>(className.name, '', 'Ожидается пустая строка вместо имени');
		assert.strictEqual<string>(className.text, '', 'Ожидается пустая строка вместо полного имени');
		assert.strictEqual<string>(className.sourceFileName, '', 'Ожидается пустая строка вместо имени файла');
	});
	it('Создание имени', function() {
		const className = new ClassName('Namespace.path1.ClassName');
		assert.instanceOf<Namespace>(className.namespace, Namespace);
		assert.strictEqual<string>(className.namespace.text, 'Namespace');
		assert.deepEqual<string[]>(className.path, ['path1']);
		assert.strictEqual<string>(className.name, 'ClassName');
		assert.strictEqual<string>(className.text, 'Namespace.path1.ClassName');
		assert.strictEqual<string>(className.sourceFileName, 'path1/ClassName.js');
	});
});