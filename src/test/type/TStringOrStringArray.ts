import { describe, it } from 'mocha';
import { assert } from 'chai';
import {
	TStringOrStringArray,
	isTStringOrStringArray,
	isEmptyStringOrStringArray
} from '../../lib/type/TStringOrStringArray';

describe('TStringOrStringArray', function() {
	it('isTStringOrStringArray', function() {
		assert.isTrue(isTStringOrStringArray(''));
		assert.isTrue(isTStringOrStringArray('Строка'));
		assert.isTrue(isTStringOrStringArray(['Строка']));
		assert.isTrue(isTStringOrStringArray(['Строка', 'Строка', 'Строка']));
	});
	it('isEmptyStringOrStringArray', function() {
		assert.isTrue(isEmptyStringOrStringArray(null));
		assert.isTrue(isEmptyStringOrStringArray(undefined));
		assert.isTrue(isEmptyStringOrStringArray(''));
		assert.isTrue(isEmptyStringOrStringArray('   '));
		assert.isTrue(isEmptyStringOrStringArray(['']));
		assert.isTrue(isEmptyStringOrStringArray(['    ']));
		assert.isTrue(isEmptyStringOrStringArray(['', '', '']));
		assert.isTrue(isEmptyStringOrStringArray(['', '', '   ']));
		assert.isFalse(isEmptyStringOrStringArray('Строка'));
		assert.isFalse(isEmptyStringOrStringArray(['Строка']));
		assert.isFalse(isEmptyStringOrStringArray(['Строка', 'Строка', 'Строка']));
	});
});