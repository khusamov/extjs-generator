import { describe, it } from 'mocha';
import { assert } from 'chai';
import { normalizeString } from '../util';
import { Ext, Code } from '../../index';

describe('Ext.code.ClassCode', function() {
	it('Ext.code.ClassCode', function() {
		const personClass = new Ext.Class('My.sample.Person', {
			name: 'Unknown',
			constructor: function(name) {
				if (name) {
					this.name = name;
				}
			},
			eat: function(foodType) {
				alert(this.name + " is eating: " + foodType);
			}
		});
		const personClassCode = new Code.ClassCode(personClass);
		assert.strictEqual<string>(
			normalizeString(personClassCode.toString()),
			normalizeString(`
				Ext.define('My.sample.Person', {
					name: 'Unknown',
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