import * as Fs from "fs";
import * as Path from 'path';
import * as Util from "util";
import * as Json5 from "json5";
import Workspace from './Workspace';
import Namespace from './Namespace';

const readFile = Util.promisify(Fs.readFile);

/**
 * Класс для чтения файла app.json из директории приложения.
 * Внимание! Не следует путать данный класс с классом ApplicationClass (которого
 * пока еще нет, но возможно в будущем будет создан).
 */
export default class Application {
	/**
	 * Создание приложения.
	 * Замена асинхронного конструктора.
	 * @param {string} dir
	 * @returns {Promise<Application>}
	 */
	static async load(dir: string): Promise<Application> {
		return await new this().load(dir);
	}

	private config: any;
	private _workspace: Workspace;

	/**
	 * Директория приложения.
	 * Абсолютный путь (сразу после вызова метода load()).
	 * Путь, относительно корня рабочего пространства (после присоединения к рабочему пространству).
	 */
	dir: string;

	get id(): string {
		return this.config.id;
	}
	get name(): string {
		return this.config.name;
	}
	get namespace(): Namespace {
		return new Namespace(this.config.namespace);
	}
	get requires(): string {
		return this.config.requires;
	}
	get workspace(): Workspace {
		return this._workspace;
	}
	set workspace(workspace: Workspace) {
		this._workspace = workspace;
		this.dir = Path.normalize(this.dir).replace(Path.normalize(workspace.dir + '/'), '');
	}

	/**
	 * Загрузка данных приложения.
	 * @param {string} dir Абсолютный путь к директории приложения.
	 * @returns {Promise<this>}
	 */
	async load(dir: string): Promise<this> {
		this.dir = dir;
		this.config = Json5.parse(await readFile(Path.join(dir, 'app.json'), {encoding: 'utf8'}));
		return this;
	}
}