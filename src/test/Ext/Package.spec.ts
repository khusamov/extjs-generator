import * as Path from 'path';
import * as Util from "util";
import * as Fs from "fs";
import * as Del from 'del';
import MakeDir = require('mkdirp-promise');

import { describe, it, before, after } from 'mocha';
import { assert } from 'chai';

import { getTargetDir, createFakeWorkspaceDir } from '../util';
import {  } from '../../index';

const readFile = Util.promisify(Fs.readFile);
const writeFile = Util.promisify(Fs.writeFile);
const stat = Util.promisify(Fs.stat);

describe('Package', function() {
	describe('Создание пустого пакета', function() {
		let workspaceDir: string, package1: Ext.Package;
		before(async () => {
			// Создание временной директории фейкового рабочего пространства.
			workspaceDir = await createFakeWorkspaceDir();
			// Загрузка рабочего пространства и создание одного пакета.
			const workspace1 = await loadWorkspaceAndCreateOnePackage(workspaceDir);
			package1 = workspace1.get('package1');
			// Сохранение рабочего пространства (а точнее лишь одного пакета) на диске.
			await workspace1.save();
		});
		after(async () => {
			// Удаление временной директории фейкового рабочего пространства.
			await Del(workspaceDir, {force: true});
		});
		describe('Структура пакета', function() {
			it('Директория пакета должна быть создана', async function() {
				const package1DirStat = await stat(Path.join(workspaceDir, 'packages/local', 'package1'));
				assert.isTrue(package1DirStat.isDirectory(), 'Путь к пакету должен существовать и быть директорией');
			});
			it('Поддиректории пакета должны быть созданы', async function() {
				const package1SourceDirStat = await stat(Path.join(workspaceDir, 'packages/local', 'package1', package1.sourceDir));
				const package1OverrideDirStat = await stat(Path.join(workspaceDir, 'packages/local', 'package1', package1.overrideDir));
				assert.isTrue(package1SourceDirStat.isDirectory(), 'Путь sourceDir должен существовать и быть директорией');
				assert.isTrue(package1OverrideDirStat.isDirectory(), 'Путь overrideDir должен существовать и быть директорией');
			});
		});
		describe('Конфигурационные файлы пакета', function() {
			let package1BuildXmlFilePath, package1PackageJsonFilePath;
			before(() => {
				// Вычисление путей к конфигурационным файлам пакета.
				package1BuildXmlFilePath = Path.join(workspaceDir, 'packages/local', 'package1', 'build.xml');
				package1PackageJsonFilePath = Path.join(workspaceDir, 'packages/local', 'package1', 'package.json');
			});
			it('Конфигурационные файлы должны быть созданы', async function() {
				const package1BuildXmlFileStat = await stat(package1BuildXmlFilePath);
				const package1PackageJsonFileStat = await stat(package1PackageJsonFilePath);
				assert.isTrue(package1BuildXmlFileStat.isFile(), 'Файл build.xml должен существовать');
				assert.isTrue(package1PackageJsonFileStat.isFile(), 'Файл package.json должен существовать');
			});
			it('Конфигурационные файлы должны содержать имя пакета', async function() {
				const package1BuildXmlFile = await readFile(package1BuildXmlFilePath, {encoding: 'utf8'});
				const package1PackageJsonFile = await readFile(package1PackageJsonFilePath, {encoding: 'utf8'});
				assert.notStrictEqual<number>(package1BuildXmlFile.indexOf('package1'), -1);
				assert.notStrictEqual<number>(package1PackageJsonFile.indexOf('package1'), -1);
			});
		});
	});

	describe('Создание пакета с несколькими классами', function() {
		describe('Из одного пространства имен', function() {
			const classInfoList = [
				'Namespace1.path1.Class1',
				'Namespace1.path1.Class2',
				'Namespace1.path2.Class3'
			].map(className => ({
				className,
				classPartFilePath: className.split('.').splice(1).join('/') + '.js'
			}));
			let workspaceDir;
			before(async () => {
				// Создание временной директории фейкового рабочего пространства.
				workspaceDir = await createFakeWorkspaceDir();
				// Загрузка рабочего пространства и создание одного пакета.
				const workspace1 = await loadWorkspaceAndCreateOnePackage(workspaceDir);
				// Создание классов в пакете package1.
				const package1Manager = workspace1.get('package1').manager;
				const namespace1 = new Ext.Namespace('Namespace1', package1Manager);
				for (let classInfo of classInfoList) namespace1.add(new Ext.BaseClass(classInfo.className));
				// Сохранение рабочего пространства (а точнее лишь одного пакета с тремя классами) на диске.
				await workspace1.save();
			});
			after(async () => {
				// Удаление временной директории фейкового рабочего пространства.
				await Del(workspaceDir, {force: true});
			});
			it('Классы должны находится на своих местах в директории пакета', async function() {
				for (let classInfo of classInfoList) {
					const classFilePath = Path.join(workspaceDir, 'packages/local', 'package1/src', classInfo.classPartFilePath);
					const classFileStat = await stat(classFilePath);
					assert.isTrue(classFileStat.isFile(), `Файл '${classFilePath}' должен существовать`);
				}
			});
			it('Содержимое файлов классов должно присутствовать', async function() {
				for (let classInfo of classInfoList) {
					const classFilePath = Path.join(workspaceDir, 'packages/local', 'package1/src', classInfo.classPartFilePath);
					const classFile = await readFile(classFilePath, {encoding: 'utf8'});
					assert.strictEqual<string>(classFile.trim(), `Ext.define('${classInfo.className}', {});`);
				}
			});
		});
		describe('Из разных пространств имен', function() {
			const classInfoList = [
				'Namespace1.path1.Class1',
				'Namespace1.path1.Class2',
				'Namespace1.path2.Class3',
				'Namespace2.path1.Class1',
				'Namespace2.path1.Class2',
				'Namespace2.path2.Class3'
			].map(className => ({
				className,
				classPartFilePath: className.split('.').splice(1).join('/') + '.js'
			}));
			let workspaceDir;
			before(async () => {
				// Создание временной директории фейкового рабочего пространства.
				workspaceDir = await createFakeWorkspaceDir();
				// Загрузка рабочего пространства и создание одного пакета.
				const workspace1 = await loadWorkspaceAndCreateOnePackage(workspaceDir);
				// Создание классов в пакете package1.
				const package1Manager = workspace1.get('package1').manager;
				for (let classInfo of classInfoList) {
					const namespaceName = classInfo.className.split('.')[0];
					let namespace;
					if (package1Manager.has(namespaceName)) {
						namespace = package1Manager.get(namespaceName);
					} else {
						// Создание пространства имен, если такового не нашлось в менеджере.
						namespace = new Ext.Namespace(namespaceName);
						package1Manager.add(namespace);
					}
					namespace.add(new Ext.BaseClass(classInfo.className));
				}
				// Сохранение рабочего пространства (пакет и классы из него) на диске.
				await workspace1.save();
			});
			after(async () => {
				// Удаление временной директории фейкового рабочего пространства.
				await Del(workspaceDir, {force: true});
			});
			it('Классы должны находится на своих местах в директории пакета', async function() {
				for (let classInfo of classInfoList) {
					const namespaceName = classInfo.className.split('.')[0];
					const classFilePath = Path.join(workspaceDir, 'packages/local', 'package1/src', namespaceName, classInfo.classPartFilePath);
					const classFileStat = await stat(classFilePath);
					assert.isTrue(classFileStat.isFile(), `Файл '${classFilePath}' должен существовать`);
				}
			});
			it('Содержимое файлов классов должно присутствовать', async function() {
				for (let classInfo of classInfoList) {
					const namespaceName = classInfo.className.split('.')[0];
					const classFilePath = Path.join(workspaceDir, 'packages/local', 'package1/src', namespaceName, classInfo.classPartFilePath);
					const classFile = await readFile(classFilePath, {encoding: 'utf8'});
					assert.strictEqual<string>(classFile.trim(), `Ext.define('${classInfo.className}', {});`);
				}
			});
		});
	});


});

/**
 * Загрузка рабочего пространства и создание одного пустого пакета в нем.
 * Вспомогательная функция.
 * @param {string} workspaceDir
 * @param {string} packageName
 * @returns {Promise<Workspace>}
 */
async function loadWorkspaceAndCreateOnePackage(workspaceDir: string, packageName: string = 'package1'): Promise<Ext.Workspace> {
	// Создание и загрузка рабочего пространства.
	const sampleWorkspace = new Ext.Workspace;
	await sampleWorkspace.load(workspaceDir);
	// Создание пакета, добавление его в рабочее пространство.
	const samplePackage = new Ext.Package(packageName);
	samplePackage.manager = new Ext.Manager;
	sampleWorkspace.add(samplePackage);
	return sampleWorkspace;
}