import * as _ from 'lodash';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Util from 'util';
import * as Del from 'del';
import { Options as IDelOptions } from 'del';
import MakeDir = require('mkdirp-promise');

import Formatter from 'khusamov-javascript-generator/dist/lib/util/Formatter';
import Manager from '../Ext/Manager';
import ClassName from '../Ext/ClassName';
import BaseClassCode from './BaseClassCode';
import BaseClass from '../Ext/class/BaseClass';

const writeFile = Util.promisify(Fs.writeFile);

/**
 * Массив соответствий пространства имен и директорий,
 * куда записывать файлы из этих пространств.
 * Директории указываются относительно targetDir.
 * Например: {
 *   'Ext': 'src/Ext',
 *   'App': 'src/App',
 *   'App.override': 'overrides'
 * }
 */
export type TPaths = {
	[key: string]: string
};

export type TSaveToResult = {
	/**
	 * Массив с именами удаленных файлов и директорий из целевой папки targetDir.
	 */
	deleted: string[]
};

export type TSaveToOptions = {
	paths?: TPaths;
	/**
	 * Набор опций для функции Del, например force: true для включения очистки внешних директорий.
	 * Если del присвоить false, то это отключить предварительную очистку директорий.
	 */
	del?: IDelOptions | boolean;
};

function setDefaultsTSaveToOptions(options: TSaveToOptions): TSaveToOptions {
	return _.merge({
		paths: {},
		del: {}
	}, options);
}

export default class ManagerCode {
	constructor(private manager: Manager) {}

	/**
	 * Сохранить файлы в целевой директории.
	 * @param {string} targetDir Целевая директория.
	 * @param {TSaveToOptions} options Массив соответствий пространства имен и директорий, куда записывать файлы из этих пространств.
	 * @returns {Promise<TSaveToResult>}
	 */
	async saveTo(targetDir: string, options: TSaveToOptions = {}): Promise<TSaveToResult> {
		options = setDefaultsTSaveToOptions(options);

		if (this.manager.count > 1 && _.isEmpty(options.paths)) {
			throw new Error('Не заданы пути для разных пространств имен.');
		}

		if (!targetDir) throw new Error('Не задана целевая директория.');

		// Массив файлов классов и их имен.
		const classFileList = this.getClassFileList(targetDir, options.paths);

		// Очистить целевую директорию (удалить предыдущие файлы и директории).
		const deleted = (
			options.del !== false
				? await Del(Path.join(targetDir, '**/*'), {
					force: true // TODO Позже эту опцию удалить. options.del
				})
				: []
		);

		// Создать новую структуру директорий на диске.
		const directoryList: string[] = _.uniq(classFileList.map(({filePath, content}) => Path.dirname(filePath)));
		for (let dir of directoryList) await MakeDir(dir);

		// Записать файлы.
		for (let {filePath, content} of classFileList) await writeFile(filePath, content);

		return {deleted} as TSaveToResult;
	}

	/**
	 * Вспомогательные функция.
	 * Получить массив полные имен и содержимого файлов классов.
	 * Содержимое файлов форматируется функцией Formatter.prettyFormat().
	 * @param {string} targetDir
	 * @param {TPaths} paths
	 * @returns {object}
	 * @returns {string} name
	 * @returns {string} content
	 */
	private getClassFileList(targetDir: string, paths: TPaths = {}): {
		filePath: string;
		content: string
	}[] {
		return this.manager.classes.map(cls => ({
			filePath: ClassName.toSourceFileName(
				cls.name,
				this.findPathByClassName(cls, targetDir, paths)
			),
			content: Formatter.prettyFormat(new BaseClassCode(cls).toString())
		}));
	}

	private findPathByClassName(cls: BaseClass, defaultPath: string, paths: TPaths = {}) {
		let result = defaultPath;
		for (let namespace in paths) {
			if (cls.name.indexOf(namespace) === 0) {
				result = Path.join(defaultPath, paths[namespace]);
				break;
			}
		}
		return result;
	}
}