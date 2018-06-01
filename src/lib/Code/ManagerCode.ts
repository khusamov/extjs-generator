import * as _ from 'lodash';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Util from 'util';
import * as Del from 'del';
import MakeDir = require('mkdirp-promise');

import Formatter from 'khusamov-javascript-generator/dist/lib/util/Formatter';
import Manager from '../Ext/Manager';
import ClassName from '../Ext/ClassName';
import ClassCode from './ClassCode';

const writeFile = Util.promisify(Fs.writeFile);

export default class ManagerCode {
	constructor(private manager: Manager) {}
	async saveTo(targetDir: string, paths?: {[key: string]: string}): Promise<{
		/**
		 * Удаленные файлы и директории из целевой папки targetDir.
		 */
		deleted: string[]
	}> {
		if (this.manager.count > 1 && !paths) {
			throw new Error('Не заданы пути для разных пространств имен.');
		}

		if (!targetDir) throw new Error('Не задана целевая директория.');

		if (paths) throw new Error('Опция paths еще не реализована!');

		// Массив файлов классов и их имен.
		const classFileList = this.getClassFileList(targetDir);

		// Очистить целевую директорию (удалить предыдущие файлы и директории).
		const deleted = await Del(Path.join(targetDir, '**/*'), {
			force: true // TODO Позже эту опцию удалить.
		});

		// Создать новую структуру директорий на диске.
		const directoryList: string[] = _.uniq(classFileList.map(({name, content}) => Path.dirname(name)));
		for (let dir of directoryList) await MakeDir(dir);

		// Записать файлы.
		for (let {name, content} of classFileList) await writeFile(name, content);

		return {deleted};
	}

	/**
	 * Получить массив полные имен и содержимого файлов классов.
	 * Содержимое файлов форматируется функцией Formatter.prettyFormat().
	 * @param {string} targetDir
	 * @returns {object}
	 * @returns {string} name
	 * @returns {string} content
	 */
	private getClassFileList(targetDir: string): {
		name: string;
		content: string
	}[] {
		return this.manager.classes.map(cls => ({
			name: ClassName.toSourceFileName(cls.name, targetDir),
			content: Formatter.prettyFormat(new ClassCode(cls).toString())
		}));
	}
}