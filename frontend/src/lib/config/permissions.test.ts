import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canWrite, isAuditReadPage } from './permissions.ts';
test('audit may browse lists, details and reports', () => {
	for (const path of [
		'/dashboard',
		'/products',
		'/products/abc',
		'/sales/123',
		'/expenses',
		'/shops/1',
		'/warehouses/2',
		'/transfers',
		'/salepersons/3',
		'/website/4',
		'/reports/sales-reports',
		'/logs'
	])
		assert.equal(isAuditReadPage(path), true, path);
});
test('audit cannot open mutation pages, settings or encoded create/edit routes', () => {
	for (const path of [
		'/products/new',
		'/sales/new/',
		'/website/123/edit',
		'/shops/1/edit',
		'/settings',
		'/table-test',
		'/products/%6eew',
		'/products/1/%65dit',
		'/products/%E0%A4%A'
	])
		assert.equal(isAuditReadPage(path), false, path);
});
test('only operational roles receive mutation controls', () => {
	assert.equal(canWrite('AUDIT'), false);
	assert.equal(canWrite(undefined), false);
	assert.equal(canWrite('unknown'), false);
	assert.equal(canWrite('SUPER_ADMIN'), true);
	assert.equal(canWrite('SALESPERSON'), true);
});
