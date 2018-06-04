import { ObjectCode } from 'khusamov-javascript-generator';
import Class from '../Ext/Class';

export default class ClassCode extends ObjectCode<Class> {
	excludeEmptyNodes = true;
	protected createExpressionToString(): string {
		return `Ext.define('${this.node.name}', ${this.nodeView.toString()})${this.suffix}`;
	}
}