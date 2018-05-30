import * as Path from "path";
import * as Os from "os";

export default {normalizeString, getTargetDir};

export function normalizeString(str: string): string {
	const EOL = '\n';
	return str.trim().split(EOL).map(str => str.trim()).join(EOL);
}

export function getTargetDir(dirname): string {
	return Path.join(Os.tmpdir(), `@${dirname}-${Math.random()}`);
}