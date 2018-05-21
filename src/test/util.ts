export function normalizeString(str: string): string {
	const EOL = '\n';
	return str.trim().split(EOL).map(str => str.trim()).join(EOL);
}