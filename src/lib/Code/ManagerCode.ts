import * as _ from 'lodash';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Del from 'del';
import * as MakeDir from 'mkdirp-promise';

import Formatter from 'khusamov-javascript-generator/dist/lib/util/Formatter';
import Manager from '../Ext/Manager';
import ClassName from '../Ext/ClassName';
import Namespace from '../Ext/Namespace';
import Class from '../Ext/Class';

export default class ManagerCode {
	constructor(private manager: Manager) {}
	saveTo(targetDir: string, paths?: string[]) {
		if (this.manager.count > 1 && !paths) {
			throw new Error('Не заданы пути для разных пространств имен.');
		}

		// Получить список классов.
		const classList: Class[] = [...this.manager].reduce<Class[]>((result, ns: Namespace) => result.concat([...ns]), []);

		Promise.resolve()

		// Очистить целевую директорию (удалить предыдущие файлы и директории).
		.then(() => {
			return Del(Path.join(targetDir, '**/*'));
		})

		// Логирование удаленных файлов и директорий.
		.then((deleted: string[]) => {
			deleted.forEach(item => console.log);
		})

		// Создать новую структуру директорий на диске.
		.then(() => {
			const directoryList: string[] = _.uniq(classList.map(cls => {
				return Path.dirname(ClassName.toSourceFileName(cls.name, targetDir));
			}));
			return Promise.all(directoryList.map(dir => MakeDir(dir)));
		})

		// Записать файлы.
		.then(() => {
			classList.forEach(cls => {
				ClassName.toSourceFileName(cls.name, targetDir)
			});
		});
	}
}