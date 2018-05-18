import * as _ from 'lodash';

export type TStringOrStringArray = string | string[];

export function isTStringOrStringArray(value): value is TStringOrStringArray {
	if (!(_.isString(value) || _.isArray(value))) return false;
	if (_.isString(value)) return true;
	if (_.isArray(value)) return value.reduce((result, item) => result && _.isString(item), true);
}

export function isEmptyStringOrStringArray(value: string | string[]): boolean {
	if (_.isNil(value)) return true;
	if (_.isString(value)) return !value.trim();
	if (_.isArray(value)) return value.length && value.reduce((result, item) => result && !item.trim(), true);
}