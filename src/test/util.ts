import * as Path from "path";
import * as Os from "os";
import MakeDir = require('mkdirp-promise');
import * as Fs from "fs";
import * as Util from "util";

const readFile = Util.promisify(Fs.readFile);
const writeFile = Util.promisify(Fs.writeFile);

export default {normalizeString, getTargetDir, createFakeWorkspaceDir};

export function normalizeString(str: string): string {
	const EOL = '\n';
	return str.trim().split(EOL).map(str => str.trim()).join(EOL);
}

export function getTargetDir(dirname): string {
	return Path.join(Os.tmpdir(), `@${dirname}-${Math.random()}`);
}

/**
 * Создание директории фейкового рабочего пространства ExtJS-проекта.
 * В директории создается конфигурационный файл workspace.json.
 * Также создается директория pir-client с файлом app.json.
 * Вспомогательная функция.
 * @returns {Promise<string>}
 */
export async function createFakeWorkspaceDir(): Promise<string> {
	const workspaceDir = getTargetDir('FakeWorkspaceDir');
	await MakeDir(workspaceDir);
	await MakeDir(Path.join(workspaceDir, 'pir-client'));
	await MakeDir(Path.join(workspaceDir, 'packages/local'));
	for (let fileInfo of [{
		from: Path.join(__dirname, 'templateFiles/workspace.json'),
		to: Path.join(workspaceDir, 'workspace.json')
	}, {
		from: Path.join(__dirname, 'templateFiles/app.json'),
		to: Path.join(workspaceDir, 'pir-client/app.json')
	}]) {
		const workspaceConfig = await readFile(fileInfo.from, {encoding: 'utf8'});
		await writeFile(fileInfo.to, workspaceConfig);
	}
	return workspaceDir;
}