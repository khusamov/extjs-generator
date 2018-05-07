import * as _ from 'lodash';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import ClassName, {IClassName} from '../lib/ClassName';
import Namespace from '../lib/Namespace';

describe('ClassName', function() {
	it('Пустое имя', function() {
		const className = new ClassName();
		assert.isUndefined(className.namespace, 'Ожидается undefined');
		assert.equal(className.text, '', 'Ожидается пустая строка вместо полного имени');
		assert.equal(className.name, '', 'Ожидается пустая строка вместо имени');
		assert.isArray(className.path, 'Ожидается массив');
		assert.equal(className.path.length, 0, 'Ожидается пустой массив');
	});

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
			assert.throw(function() {
				const parsed = ClassName.parse(name, 'Namespace2.path6');
			});
			assert.doesNotThrow(function() {
				const parsed = ClassName.parse(name, 'Namespace.path1');
			});
		});
	});


	it('Получение имени файла, соответствующего имени класса', function() {
		const name = 'Namespace.path1.path2.path3.ClassName';
		const filename = 'path1/path2/path3/ClassName.js';
		const rootPath = 'root/path';
		assert.strictEqual(ClassName.sourceFileName(name), filename);
		assert.strictEqual(ClassName.sourceFileName(name, rootPath), [rootPath, filename].join('/'));
	});
});