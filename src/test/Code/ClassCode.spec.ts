import { describe, it } from 'mocha';
import { assert } from 'chai';
import { normalizeString } from '../util';
import { Ext, Code, JavaScript } from '../../index';

describe('Code.ClassCode', function() {
	it('Code.ClassCode', function() {
		// Внимание, здесь приходится создавать узел JavaScript.ExpressionNode, потому что
		// функция alert для компилятора TypeScript не известна и компиляция не проходит.
		const personClass = new Ext.Class('My.sample.Person', {
			name: 'Unknown Person',
			constructor: function(name) {
				if (name) {
					this.name = name;
				}
			},
			eat: new JavaScript.ExpressionNode(undefined, `function(foodType) {
				alert(this.name + " is eating: " + foodType);
			}`)
		});

		const personClassCode = new Code.ClassCode(personClass);
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
	})
});