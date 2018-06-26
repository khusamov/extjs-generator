import * as Path from 'path';
import * as Del from 'del';

import { describe, it, before, after } from 'mocha';
import { assert } from 'chai';

import { createFakeWorkspaceDir, createFakeErrWorkspaceDir } from '../util';
import { Workspace } from '../../index';

describe('Workspace', function() {
	describe('Рабочее пространство с одним приложением', function() {
		let workspaceDir: string;
		before(async () => {
			// Создание временной директории фейкового рабочего пространства.
			workspaceDir = await createFakeWorkspaceDir();
		});
		it('Чтение директорий приложений в рабочем пространстве', async function() {
			const workspace = await Workspace.load(workspaceDir);
			assert.strictEqual<number>(workspace.applications.length, 1);
			assert.strictEqual<string>(workspace.applications[0].dir, 'pir-client');
			assert.strictEqual<string>(workspace.applications[0].name, 'PirClient');
		});
		after(async () => {
			// Удаление временной директории фейкового рабочего пространства.
			await Del(workspaceDir, {force: true});
		});
	});
	describe('Рабочее пространство с неправильной ссылкой на приложение', function() {
		let workspaceDir: string;
		before(async () => {
			// Создание временной директории фейкового рабочего пространства.
			workspaceDir = await createFakeErrWorkspaceDir();
		});
		it('Проверка генерации ошибки', async function() {
			try {
				await new Workspace().load(workspaceDir);
			} catch (e) {
				assert.throw(function() {
					throw e;
				}, [
					`Приложение 'pir-client' не найдено.`,
					`Исправьте файл '${Path.join(workspaceDir, 'workspace.json')}'.`
				].join(' '));
			}
		});
		after(async () => {
			// Удаление временной директории фейкового рабочего пространства.
			await Del(workspaceDir, {force: true});
		});
	});

});