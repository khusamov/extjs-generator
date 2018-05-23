import * as _ from 'lodash';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Util from 'util';
import * as Del from 'del';
import MakeDir = require('mkdirp-promise');

import Formatter from 'khusamov-javascript-generator/dist/lib/util/Formatter';
import Manager from '../Ext/Manager';
import ClassName from '../Ext/ClassName';
import Namespace from '../Ext/Namespace';
import Class from '../Ext/Class';
import ClassCode from './ClassCode';

const writeFile = Util.promisify(Fs.writeFile);

export default class ManagerCode {
	constructor(private manager: Manager) {}
	async saveTo(targetDir: string, paths?: string[]): Promise<void> {
		if (this.manager.count > 1 && !paths) {
			throw new Error('Не заданы пути для разных пространств имен.');
		}

		if (!targetDir) throw new Error('Не задана целевая директория.');

		if (paths) throw new Error('Опция paths еще не реализована!');

		// Очистить целевую директорию (удалить предыдущие файлы и директории).
		const deleted = await Del(Path.join(targetDir, '**/*'), {
			force: true // TODO Позже эту опцию удалить.
		});

		// Логирование удаленных файлов и директорий.
		deleted.forEach(item => console.log);

		// Массив файлов классов и их имен.
		const classFileList: {
			name: string;
			content: string
		}[] = this.manager.classes.map(cls => ({
			name: ClassName.toSourceFileName(cls.name, targetDir),
			content: Formatter.prettyFormat(new ClassCode(cls).toString())
		}));

		// Создать новую структуру директорий на диске.
		const directoryList: string[] = _.uniq(classFileList.map(({name, content}) => Path.dirname(name)));
		for (let dir of directoryList) await MakeDir(dir);

		// Записать файлы.
		for (let classFile of classFileList) await writeFile(classFile.name, classFile.content);
	}
}