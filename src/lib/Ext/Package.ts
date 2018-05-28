import * as _ from 'lodash';
import * as Del from 'del';
import * as Path from 'path';
import MakeDir = require('mkdirp-promise');
import * as pascalcase from 'pascalcase';
import Workspace from './Workspace';
import Manager from './Manager';
import * as Fs from "fs";
import * as Util from "util";
import ManagerCode from '../Code/ManagerCode';
import Class from './Class';

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

	sourceDir: 'src';
	overrideDir: 'overrides';

	get dir(): string {
		return Path.join(this.workspace.dir, 'packages/local', this.name);
	}

	/**
	 * Конвертирует имя пакета по шаблону:
	 * 'scrum-sim -> Scrum.sim'.
	 * @returns {string}
	 */
	get namespace(): string {
		return [pascalcase(this.name.split('-')[0])].concat(this.name.split('-').slice(1)).join('.');
	}

	constructor(public name: string, public workspace: Workspace) {}

	/**
	 * Удаляет все файлы в директории пакета, если они есть.
	 * Создает директорию с именем пакета.
	 * Создает в директории файлы package.json и build.xml
	 * Сохраняет классы в директории src и overrides.
	 * Внимание, классы override отделяются из общей кучи классов.
	 */
	async save() {
		// Очистить целевую директорию (удалить предыдущие файлы и директории).
		const deleted = await Del(Path.join(this.dir, '**/*'), {
			force: true // TODO Позже эту опцию удалить.
		});
		// Создание структуры директорий пакета.
		for (let dir of [
			this.dir,
			this.overrideDir,
			this.sourceDir
		]) {
			await MakeDir(dir);
		}
		// package.json и build.xml
		const files = await Promise.all(
			[{
				from: Path.join(__dirname, 'package.build.xml'),
				to: Path.join(this.dir, 'build.xml')
			}, {
				from: Path.join(__dirname, 'package.json'),
				to: Path.join(this.dir, 'package.json')
			}].map(async path => ({
				path,
				content: await readFile(path.from, {encoding: 'utf8'})
			}))
		);
		const preparedFiles = files.map(file => _.merge(file, {
			content: (
				file.content
					.replace(new RegExp('{{name}}', 'g'), this.name)
					.replace(new RegExp('{{namespace}}', 'g'), this.namespace)
			)
		}));
		for (let file of preparedFiles) {
			await writeFile(file.path.to, file.content);
		}
		// Сохранение классов в директории src и overrides.
		const sourceClsManager = this.manager.map(ns => ns.filter(cls => !cls.isOverride)).filter(ns => ns.hasClasses);
		const overrideClsManager = this.manager.map(ns => ns.filter(cls => cls.isOverride)).filter(ns => ns.hasClasses);
		await new ManagerCode(sourceClsManager).saveTo(Path.join(this.dir, this.sourceDir));
		await new ManagerCode(overrideClsManager).saveTo(Path.join(this.dir, this.overrideDir));

	}

	private loadTemplateFile() {}
}