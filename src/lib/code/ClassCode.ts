import { ObjectCode } from 'khusamov-javascript-generator';
import Class from '../Class';

export default class ClassCode extends ObjectCode<Class> {
	protected createExpressionToString(): string {
		return `Ext.define('${this.node.name}', ${this.nodeView.toString()})${this.suffix}`;
	}
}