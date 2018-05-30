import * as Path from 'path';
import * as Util from "util";
import * as Fs from "fs";
import * as Del from 'del';
import MakeDir = require('mkdirp-promise');

import { describe, it } from 'mocha';
import { assert } from 'chai';

import { getTargetDir } from '../util';
import { Ext } from '../../index';

const readFile = Util.promisify(Fs.readFile);
const writeFile = Util.promisify(Fs.writeFile);

describe('Package', function() {
	it('Package', async function() {


		const workspaceDir = await createFakeWorkspace();
		const workspace1 = new Ext.Workspace;
		await workspace1.load(workspaceDir);
		const package1 = new Ext.Package('package1');
		package1.manager = new Ext.Manager;
		workspace1.add(package1);
		await workspace1.save();

		// TODO сделать assert...


		// await Del(targetDir, {force: true});
	});
});

/**
 * Вспомогательная функция для создания фейкового пространства ExtJS-проекта.
 */
async function createFakeWorkspace(): Promise<string> {
	const workspaceDir = getTargetDir('FakeWorkspaceDir');
	await MakeDir(workspaceDir);



	const workspaceConfigFilename = {
		from: Path.join(__dirname, 'workspace.json'),
		to: Path.join(workspaceDir, 'workspace.json')
	};


	const workspaceConfig = await readFile(workspaceConfigFilename.from, {encoding: 'utf8'});
	await writeFile(workspaceConfigFilename.to, workspaceConfig);
	return workspaceDir;
}