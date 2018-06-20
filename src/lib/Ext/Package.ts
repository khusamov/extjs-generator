import * as _ from 'lodash';
import * as Del from 'del';
import * as Path from 'path';
import * as Fs from "fs";
import * as Util from "util";
import * as pascalcase from 'pascalcase';
import MakeDir = require('mkdirp-promise');
import Workspace from './Workspace';
import Manager from './Manager';
import ManagerCode from '../Code/ManagerCode';

const readFile = Util.promisify(Fs.readFile);
const writeFile = Util.promisify(Fs.writeFile);

/**
 * Генератор пакета в директории рабочего пространства.
 */
export default class Package {
	/**
	 * Менеджер пространств имен и классов,
	 * которые должны располагаться в директории src пакета.
	 */
	manager: Manager;

	/**
	 * Директория с исходными кодами пакета.
	 * Путь относительно корня пакета.
	 * @property {string}
	 */
	sourceDir = 'src';
	/**
	 * Директория с оверрайтами пакета.
	 * Путь относительно корня пакета.
	 * @property {string}
	 */
	overrideDir = 'overrides';

	/**
	 * Директория пакета.
	 * Абсолютный путь.
	 * @property {string}
	 */
	get dir(): string {
		return Path.join(this.workspace.dir, 'packages/local', this.name);
	}

	/**
	 * Пространство имен классов, данного пакета.
	 * Вычисляется автоматически из имени пакета по схеме: 'scrum-sim -> Scrum.sim'.
	 * @property {string}
	 */
	get namespace(): string {
		return [pascalcase(this.name.split('-')[0])].concat(this.name.split('-').slice(1)).join('.');
	}

	/**
	 * Рабочее пространство, в котором располагается данный пакет.
	 * @property {Workspace}
	 */
	public workspace?: Workspace;

	constructor(
		/**
		 * Имя пакета.
		 * Например 'pir-client'.
		 * @property {string}
		 */
		public name: string
	) {}

	/**
	 * Сохранение новых данных пакета в директорию пакета.
	 * Предназначен для сохранения классов на диске из менеджера классов пакета.
	 * Производимые действия:
	 * Удаляет все файлы в директории пакета, если они есть.
	 * Создает директорию пакета в packages/local/<Имя пакета>.
	 * Создает в директории файлы package.json и build.xml
	 * Сохраняет классы в директориях src и overrides.
	 * Внимание, классы '<Пространство имен>.override.' отделяются из общей кучи классов.
	 */
	async save() {
		if (!this.workspace) throw new Error('Не определено рабочее пространство.');
		if (!this.workspace.dir) throw new Error('Не определена директория рабочего пространства.');
		if (!this.sourceDir) throw new Error('Не определена директория sourceDir.');
		if (!this.overrideDir) throw new Error('Не определена директория overrideDir.');

		// Очистить целевую директорию (удалить предыдущие файлы и директории).
		const deleted = await Del(Path.join(this.dir, '**/*'), {
			force: true // TODO Позже эту опцию удалить.
		});
		// Создание структуры директорий пакета.
		const sourceDirPath = Path.join(this.dir, this.sourceDir), overrideDirPath = Path.join(this.dir, this.overrideDir);
		for (let dir of [this.dir, sourceDirPath, overrideDirPath]) await MakeDir(dir);
		// Создание в директории пакета файлов: package.json и build.xml
		await this.writeConfigFiles(['name', 'namespace'], [{
			from: 'package.build.xml',
			to: 'build.xml'
		}, {
			from: 'package.json',
			to: 'package.json'
		}]);
		// Сохранение классов в директории src (sourceDir) и overrides (overrideDir).
		if (this.manager) {
			await new ManagerCode(this.manager).saveTo(this.dir, {
				del: false,
				paths: [...this.manager].map(ns => ns.name).reduce((result, namespaceName) => {
					return _.merge(result, {
						// Классы записываются в каталог <package-dir>/src.
						// Классы начинающиеся на Namespace.override записываются в каталог <package-dir>/override.
						// Если пространств имен больше одного, то в имена директорий встраиваются имена пространства имен:
						// <package-dir>/<Namespace>/src и <package-dir>/<Namespace>/override.
						[namespaceName]: this.manager.count > 1 ? Path.join(this.sourceDir, namespaceName) : this.sourceDir,
						[namespaceName + '.override']: this.manager.count > 1 ? Path.join(this.overrideDir, namespaceName) : this.overrideDir
					});
				}, {})
			});
		}
	}

	/**
	 * Запись шаблонных файлов.
	 * Файлы считываются с __dirname/from, записываются в this.dir/to
	 * В каждом файле производится замена {{параметров}} на значения из this.
	 * @param {object[]} fileMap
	 * @param {string} fileMap.from
	 * @param {string} fileMap.to
	 * @param {string[]} names
	 * @returns {Promise<void>}
	 */
	private async writeConfigFiles(names: string[], fileMap: {from: string, to: string}[]) {
		const files = await Promise.all(
			fileMap.map(file => ({
				from: file.from,
				to: file.to
			})).map(async path => ({
				path,
				content: await readFile(Path.join(__dirname, 'fileTpl', path.from), {encoding: 'utf8'})
			}))
		);
		const preparedFiles = files.map(file => _.merge(file, {
			content: (
				names.reduce(
					(content, paramName) => content.replace(new RegExp(`{{${paramName}}}`, 'g'), this[paramName]),
					file.content
				)
			)
		}));
		for (let file of preparedFiles) {
			await writeFile(Path.join(this.dir, file.path.to), file.content);
		}
	}
}