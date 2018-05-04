import * as _ from 'lodash';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import ClassName from '../lib/ClassName';

describe('ClassName', function() {
	it('Пустое имя', function() {
		const className = new ClassName();
		assert.isUndefined(className.namespace, 'Ожидается undefined');
		assert.equal(className.fullName, '', 'Ожидается пустая строка');
		assert.equal(className.name, '', 'Ожидается пустая строка');
		assert.isArray(className.path, 'Ожидается массив');
		assert.equal(className.path.length, 0, 'Ожидается пустой массив');
	});
});