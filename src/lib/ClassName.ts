import Namespace from './Namespace';

export default class ClassName {
	get fullName(): string {
		return '';
	}
	get path(): string[] {
		return [];
	}
	get namespace(): Namespace {
		return undefined;
	}
	get name(): string {
		return '';
	}
	constructor(name?: string) {}
}