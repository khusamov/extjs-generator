import { describe, it, before, after } from 'mocha';
import { assert } from 'chai';
import { Application } from '../../index';

describe('Application', function() {
	it('Директория приложения не найдена', async function() {
		// https://toster.ru/q/541330
		try {
			await new Application().load('path/to/app');
		} catch (e) {
			assert.throw(function() {
				throw e;
			}, `Директория приложения не найдена 'path/to/app'.`);
		}
	});
});