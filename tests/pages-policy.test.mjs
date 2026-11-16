import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow=readFileSync(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');

test('both Pages upload and deployment require a push on main',()=>{
  const guard="github.ref == 'refs/heads/main' && github.event_name == 'push'";
  const conditions=workflow.split('\n').filter(x=>x.trim().startsWith('if:'));
  assert.equal(conditions.length,2);
  assert.ok(conditions.every(x=>x.includes(guard)),conditions.join('\n'));
  assert.match(workflow,/pull_request:/);
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/uses: actions\/upload-pages-artifact@/);
  assert.match(workflow,/uses: actions\/deploy-pages@/);
});
