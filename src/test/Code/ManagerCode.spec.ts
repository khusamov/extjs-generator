import * as Fs from "fs";
import * as Util from "util";
import * as Del from 'del';

import { describe, it, before, after } from 'mocha';
import { assert } from 'chai';

import { ObjectNode } from 'khusamov-javascript-generator';
import { getTargetDir } from '../util';
import { Manager, Namespace, BaseClass, ClassName, ManagerCode } from '../../index';

const readFile = Util.promisify(Fs.readFile);

describe('ManagerCode', function() {
	describe('Запись класса в файл', function() {
		let targetDir;
		// Перед тестом генерируем путь к временной директории.
		before(() => {targetDir = getTargetDir('ManagerCodeTestDir');});
		// После теста удаляем временную директорию.
		after(async () => await Del(targetDir, {force: true}));
		it('Запись класса в файл', async function() {
			// Создаем менеджер с кодом.
			const manager1 = new Manager();
			const namespace1 = new Namespace('Namespace1', manager1);
			const class1 = new BaseClass('Namespace1.Class1', namespace1);
			// Создаем объект для преобразования содержимого менеджера в файлы с кодом классов.
			const managerCode1 = new ManagerCode(manager1);
			// Сохраняем код во временную директорию.
			await managerCode1.saveTo(targetDir);
			// Проверяем сохраненный результат.
			const class1FilePath = ClassName.toSourceFileName(class1.name, targetDir);
			const class1FileContent = await readFile(class1FilePath, {encoding: 'utf8'});
			assert.equal(class1FileContent, `Ext.define('Namespace1.Class1', {});\n`);
		});
	});
	describe('Проверка, не перезаписывается ли Class.valueDefault', function() {
		it('ObjectNode', function() {
			const node1 = new ObjectNode('node1', {
				property1: 'value of property1'
			});
			const node2 = new ObjectNode('node2');
			assert.isUndefined(node2.get('property1'));
		});
		it('Ext.Class', function() {
			const class1 = new BaseClass('Namespace1.Class1', {
				property1: 'value of property1'
			});
			const class2 = new BaseClass('Namespace2.Class2');
			assert.isUndefined(class2.get('property1'));
		});
	});
});