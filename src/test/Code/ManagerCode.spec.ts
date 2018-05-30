import * as Fs from "fs";
import * as Util from "util";
import * as Del from 'del';

import { describe, it } from 'mocha';
import { assert } from 'chai';

import { getTargetDir } from '../util';
import { Ext, Code } from '../../index';

const readFile = Util.promisify(Fs.readFile);

describe('ManagerCode', function() {
	it('Запись класса в файл', async function() {
		const manager1 = new Ext.Manager();
		const namespace1 = new Ext.Namespace('Namespace1', manager1);
		const class1 = new Ext.Class('Namespace1.Class1', namespace1);
		const managerCode1 = new Code.ManagerCode(manager1);
		const targetDir = getTargetDir('ManagerCodeTestDir');

		await managerCode1.saveTo(targetDir);

		const class1fileContent = await readFile(Ext.ClassName.toSourceFileName(class1.name, targetDir), {encoding: 'utf8'});
		assert.equal(class1fileContent, `Ext.define('Namespace1.Class1', {});\n`);

		await Del(targetDir, {force: true});
	});
});