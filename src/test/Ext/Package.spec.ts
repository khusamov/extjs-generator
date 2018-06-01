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
const stat = Util.promisify(Fs.stat);

describe('Package', function() {
	it('Создание пустого пакета', async function() {
		// Создание временной директории фейкового рабочего пространства.
		const workspaceDir = await createFakeWorkspace();
		// Создание пустого пакета в фейковом рабочем пространстве.
		const workspace1 = new Ext.Workspace;
		await workspace1.load(workspaceDir);
		const package1 = new Ext.Package('package1');
		package1.manager = new Ext.Manager;
		workspace1.add(package1);
		await workspace1.save();
		// Проверка, создан ли пакет или нет.
		const package1DirStat = await stat(Path.join(workspaceDir, 'packages/local', 'package1'));
		assert.isTrue(package1DirStat.isDirectory(), 'Путь к пакету должен существовать и быть директорией');
		// Проверка, созданы ли директории пакета или нет.
		const package1SourceDirStat = await stat(Path.join(workspaceDir, 'packages/local', 'package1', package1.sourceDir));
		const package1OverrideDirStat = await stat(Path.join(workspaceDir, 'packages/local', 'package1', package1.overrideDir));
		assert.isTrue(package1SourceDirStat.isDirectory(), 'Путь sourceDir должен существовать и быть директорией');
		assert.isTrue(package1OverrideDirStat.isDirectory(), 'Путь overrideDir должен существовать и быть директорией');
		// Проверка, созданы ли конфигурационные файлы пакета или нет.
		const package1BuildXmlFilePath = Path.join(workspaceDir, 'packages/local', 'package1', 'build.xml');
		const package1PackageJsonFilePath = Path.join(workspaceDir, 'packages/local', 'package1', 'package.json');
		const package1BuildXmlFileStat = await stat(package1BuildXmlFilePath);
		const package1PackageJsonFileStat = await stat(package1PackageJsonFilePath);
		assert.isTrue(package1BuildXmlFileStat.isFile(), 'Файл build.xml должен существовать и быть директорией');
		assert.isTrue(package1PackageJsonFileStat.isFile(), 'Файл package.json должен существовать и быть директорией');
		// Проверка, содержат ли конфигурационные файлы имя пакета или нет.
		const package1BuildXmlFile = await readFile(package1BuildXmlFilePath, {encoding: 'utf8'});
		const package1PackageJsonFile = await readFile(package1PackageJsonFilePath, {encoding: 'utf8'});
		assert.notStrictEqual<number>(package1BuildXmlFile.indexOf('package1'), -1);
		assert.notStrictEqual<number>(package1PackageJsonFile.indexOf('package1'), -1);
		// Удаление временной директории фейкового рабочего пространства.
		await Del(workspaceDir, {force: true});
	});
	it('Создание пакета с двумя классами из одного пространства имен', async function() {
		// Создание временной директории фейкового рабочего пространства.
		const workspaceDir = await createFakeWorkspace();
		// Создание пустого пакета в фейковом рабочем пространстве.
		const workspace1 = new Ext.Workspace;
		await workspace1.load(workspaceDir);
		const package1 = new Ext.Package('package1');
		const manager = new Ext.Manager;
		package1.manager = manager;
		workspace1.add(package1);
		// Создание классов
		const namespace1 = new Ext.Namespace('Namespace1', manager);
		const class1 = new Ext.Class('Namespace1.path1.Class1', namespace1);
		const class2 = new Ext.Class('Namespace1.path1.Class2', namespace1);



		// Сохранение файлов на диске.
		await workspace1.save();
		// Удаление временной директории фейкового рабочего пространства.
		// await Del(workspaceDir, {force: true});
	});
});

/**
 * Вспомогательная функция для создания фейкового рабочего пространства ExtJS-проекта.
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