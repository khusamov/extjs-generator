import * as Fs from "fs";
import * as Path from 'path';
import * as Util from "util";
import * as Json5 from "json5";
import Workspace from './Workspace';

const readFile = Util.promisify(Fs.readFile);

/**
 * Класс для чтения файла app.json из директории приложения.
 * Внимание! Не следует путать данный класс с классом ApplicationClass (которого
 * пока еще нет, но возможно в будущем будет создан).
 */
export default class Application {
	static async load(dir: string): Promise<Application> {
		const app = new this();
		await app.load(dir);
		app.dir = dir;
		return app;
	}
	private config: any;
	private _workspace: Workspace;
	dir: string;
	get id(): string {
		return this.config.id;
	}
	get name(): string {
		return this.config.name;
	}
	get namespace(): string {
		return this.config.namespace;
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
	constructor() {}
	async load(dir: string) {
		this.config = Json5.parse(await readFile(Path.join(dir, 'app.json'), {encoding: 'utf8'}));
	}
}