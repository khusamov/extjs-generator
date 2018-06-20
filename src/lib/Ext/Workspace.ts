import * as Fs from 'fs';
import * as Path from 'path';
import * as Util from 'util';
import * as Json5 from 'json5';
import Package from './Package';
import BaseClass from './class/BaseClass';
import Application from './Application';

const readFile = Util.promisify(Fs.readFile);

/**
 * Рабочее пространства ExtJS-проекта.
 * Представляет из себя коллекцию пакетов проекта (Package[]).
 * Предоставляет следующие функции:
 * Чтение и парсинг директории с рабочим пространством проекта на Sencha ExtJS.
 * Чтение приложений, прописанных в конфигурационном файле рабочего пространства.
 */
export default class Workspace {
	private config: any;
	private packages: Package[] = [];
	dir: string;
	applications: Application[] = [];

	/**
	 * Создает рабочее пространство и загружает указанную директорию.
	 * Замена асинхронного конструктора.
	 * @param {string} dir
	 * @returns {Promise<Workspace>}
	 */
	static async load(dir: string): Promise<Workspace> {
		const workspace = new this();
		await workspace.load(dir);
		return workspace;
	}

	constructor() {}
	async load(dir: string) {
		this.dir = dir;
		const configFilePath = Path.join(dir, 'workspace.json');
		this.config = Json5.parse(await readFile(configFilePath, {encoding: 'utf8'}));
		// Загрузка приложений.
		if ('apps' in this.config) {
			for (let appDir of this.config.apps) {
				const app = await Application.load(Path.join(this.dir, appDir));
				app.workspace = this;
				this.applications.push(app);
			}
		}
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

	async save() {
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