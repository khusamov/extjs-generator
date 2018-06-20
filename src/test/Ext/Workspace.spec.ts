import * as Del from 'del';

import { describe, it, before, after } from 'mocha';
import { assert } from 'chai';

import { getTargetDir, createFakeWorkspaceDir } from '../util';
import { Workspace } from '../../index';

describe('Workspace', function() {
	let workspaceDir: string;
	before(async () => {
		// Создание временной директории фейкового рабочего пространства.
		workspaceDir = await createFakeWorkspaceDir();
	});
	after(async () => {
		// Удаление временной директории фейкового рабочего пространства.
		await Del(workspaceDir, {force: true});
	});
	it('Чтение директорий приложений в рабочем пространстве', async function() {
		const workspace = await Workspace.load(workspaceDir);
		assert.strictEqual<number>(workspace.applications.length, 1);
		assert.strictEqual<string>(workspace.applications[0].dir, 'pir-client');
		assert.strictEqual<string>(workspace.applications[0].name, 'PirClient');
	});
});