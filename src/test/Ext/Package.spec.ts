import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Ext } from '../../index';

describe('Package', function() {
	it('Package', async function() {
		const workspaceDir = createFakeWorkspace();
		const workspace1 = new Ext.Workspace;
		await workspace1.load(workspaceDir);
		const package1 = new Ext.Package('package1');
		package1.manager = new Ext.Manager;
		workspace1.add(package1);
		await workspace1.save();
	});
});

/**
 * Вспомогательная функция для создания фейкового пространства ExtJS-проекта.
 */
function createFakeWorkspace(): string {
	return '';
}