import * as Fs from 'fs';
import * as Path from 'path';
import * as Util from 'util';
import * as Json5 from 'json5';
import Package from './Package';
import Class from './Class';

const readFile = Util.promisify(Fs.readFile);

/**
 * Рабочее пространства ExtJS-проекта.
 * Представляет из себя коллекцию пакетов проекта (Package[]).
 * Предоставляет следующие функции:
 * Чтение и парсинг директории с рабочим пространством проекта на Sencha ExtJS.
 */
export default class Workspace {
	private config: object;
	private packages: Package[] = [];
	public dir: string;
	constructor() {}
	async load(dir: string) {
		this.dir = dir;
		const configFilePath = Path.join(dir, 'workspace.json');
		this.config = Json5.parse(await readFile(configFilePath, {encoding: 'utf8'}));
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