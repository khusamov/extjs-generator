import { ObjectCode } from 'khusamov-javascript-generator';
import BaseClass from '../Ext/class/BaseClass';

export default class BaseClassCode extends ObjectCode<BaseClass> {
	excludeEmptyNodes = true;
	protected createExpressionToString(): string {
		return `Ext.define('${this.node.name}', ${this.nodeView.toString()})${this.suffix}`;
	}
}