import * as Fs from "fs";
import * as Util from "util";
import * as Del from 'del';

import { describe, it } from 'mocha';
import { assert } from 'chai';

import { getTargetDir } from '../util';
import {Ext, Code, JavaScript} from '../../index';

const readFile = Util.promisify(Fs.readFile);

describe('ManagerCode', function() {
	it('Запись класса в файл', async function() {
		const targetDir = getTargetDir('ManagerCodeTestDir');
		// Создаем менеджер с кодом.
		const manager1 = new Ext.Manager();
		const namespace1 = new Ext.Namespace('Namespace1', manager1);
		const class1 = new Ext.Class('Namespace1.Class1', namespace1);
		// Создаем объект для преобразования содержимого менеджера в файлы с кодом классов.
		const managerCode1 = new Code.ManagerCode(manager1);
		// Сохраняем код во временную директорию.
		await managerCode1.saveTo(targetDir);
		// Проверяем сохраненный результат.
		const class1FilePath = Ext.ClassName.toSourceFileName(class1.name, targetDir);
		const class1FileContent = await readFile(class1FilePath, {encoding: 'utf8'});
		assert.equal(class1FileContent, `Ext.define('Namespace1.Class1', {});\n`);
		// Удаляем временную директорию.
		await Del(targetDir, {force: true});
	});
});