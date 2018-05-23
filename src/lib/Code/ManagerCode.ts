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

		// Получить список классов.
		const classList: Class[] = (
			[...this.manager].reduce<Class[]>((result, ns: Namespace) => result.concat([...ns]), [])
		);

		// Очистить целевую директорию (удалить предыдущие файлы и директории).
		const deleted = await Del(Path.join(targetDir, '**/*'));

		// Логирование удаленных файлов и директорий.
		deleted.forEach(item => console.log);

		// Создать новую структуру директорий на диске.
		const directoryList: string[] = _.uniq(classList.map(cls => {
			return Path.dirname(ClassName.toSourceFileName(cls.name, targetDir));
		}));
		for (let dir of directoryList) await MakeDir(dir);

		// Записать файлы.
		classList.forEach(cls => {
			const code = new ClassCode(cls);
			const fileName = ClassName.toSourceFileName(cls.name, targetDir);
			const fileContent = Formatter.prettyFormat(code.toString());
		});


		// Promise.resolve()
		//
		// // Очистить целевую директорию (удалить предыдущие файлы и директории).
		// .then(() => {
		// 	return Del(Path.join(targetDir, '**/*'));
		// })
		//
		// // Логирование удаленных файлов и директорий.
		// .then((deleted: string[]) => {
		// 	deleted.forEach(item => console.log);
		// })
		//
		// // Создать новую структуру директорий на диске.
		// .then(() => {
		// 	const directoryList: string[] = _.uniq(classList.map(cls => {
		// 		return Path.dirname(ClassName.toSourceFileName(cls.name, targetDir));
		// 	}));
		// 	return Promise.all(directoryList.map(dir => MakeDir(dir)));
		// })
		//
		// // Записать файлы.
		// .then(() => {
		// 	classList.forEach(cls => {
		// 		const code = new ClassCode(cls);
		// 		const fileName = ClassName.toSourceFileName(cls.name, targetDir);
		// 		const fileContent = Formatter.prettyFormat(code.toString());
		// 	});
		// });
	}
}