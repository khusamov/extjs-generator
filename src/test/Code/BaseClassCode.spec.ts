import { describe, it } from 'mocha';
import { assert } from 'chai';
import { normalizeString } from '../util';
import { FunctionNode } from 'khusamov-javascript-generator';
import { BaseClass, BaseClassCode } from '../../index';

describe('BaseClassCode', function() {
	it('Пример использования', function() {
		const personClass = new BaseClass('My.sample.Person', {
			name: 'Unknown Person',
			constructor: function(name) {
				if (name) {
					this.name = name;
				}
			},
			// Внимание, здесь приходится создавать узел FunctionNode, потому что
			// функция alert для компилятора TypeScript не известна и компиляция не проходит.
			eat: FunctionNode.nameless`function(foodType) {
				alert(this.name + " is eating: " + foodType);
			}`
		});

		const personClassCode = new BaseClassCode(personClass);
		assert.strictEqual<string>(
			normalizeString(personClassCode.toString()),
			normalizeString(`
				Ext.define('My.sample.Person', {
					name: 'Unknown Person',
					constructor: function(name) {
						if (name) {
							this.name = name;
						}
					},
					eat: function(foodType) {
						alert(this.name + " is eating: " + foodType);
					}
				});
			`)
		);
	});
});