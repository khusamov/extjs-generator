import * as Fs from 'fs';
import * as Path from 'path';
import * as Util from 'util';
import * as Json5 from 'json5';
import Package from './Package';
import Application from './Application';

const readFile = Util.promisify(Fs.readFile);
const access = Util.promisify(Fs.access);

/**
 * Рабочее пространства ExtJS-проекта.
 * Представляет из себя коллекцию пакетов проекта (Package[]).
 * Предоставляет следующие функции:
 * Чтение и парсинг директории с рабочим пространством проекта на Sencha ExtJS.
 * Чтение приложений, прописанных в конфигурационном файле рабочего пространства.
 */
export default class Workspace {
	static async dirExists(dir: string): Promise<boolean> {
		try {
			await access(Path.join(dir));
		} catch (e) {
			return false;
		}
		return true;
	}

	private config: any;
	private packages: Package[] = [];

	/**
	 * Директория рабочего пространства.
	 * Абсолютный путь.
	 * @property {string}
	 */
	dir: string;

	/**
	 * Массив приложений рабочего пространства.
	 * @property {Application[]}
	 */
	applications: Application[] = [];

	/**
	 * Создает рабочее пространство и загружает указанную директорию.
	 * Замена асинхронного конструктора.
	 * @param {string} dir
	 * @returns {Promise<Workspace>}
	 */
	static async load(dir: string): Promise<Workspace> {
		return await new this().load(dir);
	}

	/**
	 * Загрузка данных о рабочем пространстве.
	 * @param {string} dir
	 * @returns {Promise<void>}
	 */
	async load(dir: string): Promise<this> {
		this.dir = dir;
		const configFilePath = Path.join(dir, 'workspace.json');

		// Предварительная версия обработки ошибок функции Fs.readFile().
		let configFileData;
		try {
			configFileData = await readFile(configFilePath, {encoding: 'utf8'});
		} catch(e) {
			Error.captureStackTrace(e);
			throw e;
		}

		this.config = Json5.parse(configFileData);
		// Загрузка приложений.
		if ('apps' in this.config) {
			for (let appDir of this.config.apps) {
				if (!await Application.dirExists(Path.join(this.dir, appDir))) {
					throw new Error(`Приложение '${appDir}' не найдено. Исправьте файл '${configFilePath}'.`);
				}
				const app = await Application.load(Path.join(this.dir, appDir));
				app.workspace = this;
				this.applications.push(app);
			}
		}
		return this;
	}

	/**
	 * Добавить пакет в рабочее пространство.
	 * @param {Package} pkg
	 * @returns {Workspace}
	 */
	add(pkg: Package): this {
		pkg.workspace = this;
		this.packages.push(pkg);
		return this;
	}

	/**
	 * Сохранение пакетов рабочего пространства на диске.
	 * @returns {Promise<void>}
	 */
	async save(): Promise<void> {
		await Promise.all(this.packages.map(pkg => pkg.save()));
	}

	/**
	 * Получить пакет по его имени.
	 * @param {string} packageName
	 * @returns {Package | undefined}
	 */
	get(packageName: string): Package | undefined {
		return this.packages.find(pkg => pkg.name === 'package1');
	}

	/**
	 * Реализация итератора для рабочего пространства.
	 * @returns {IterableIterator<Package>}
	 */
	*[Symbol.iterator](): IterableIterator<Package> {
		for (let pkg of this.packages) yield pkg;
	}
}