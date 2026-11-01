import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import questionsData from '../src/data/questions.json' with { type: 'json' };
import tasksData from '../src/data/tasks.json' with { type: 'json' };

const rootDir = process.cwd();

test('tasks.json has exactly 8 areas × 30 days = 240 complete tasks with alternatives, tags, and light days', () => {
  const areaIds = questionsData.alanlar.map(a => a.id);
  assert.equal(areaIds.length, 8);
  assert.equal(tasksData.gorevler.length, 240);

  for (const areaId of areaIds) {
    assert.ok((questionsData.alanaOzelSorular[areaId] || []).length >= 4, `Missing area questions for ${areaId}`);
    const areaTasks = tasksData.gorevler.filter(t => t.alan === areaId).sort((a, b) => a.gun - b.gun);
    assert.equal(areaTasks.length, 30, `Expected 30 tasks for ${areaId}`);

    for (let day = 1; day <= 30; day++) {
      const task = areaTasks[day - 1];
      assert.equal(task.gun, day);
      assert.ok(task.id && task.baslik && task.neden && task.alternatif, `Missing required text fields in ${task.id}`);
      assert.ok(Array.isArray(task.adimlar) && task.adimlar.length >= 2, `Expected >=2 steps in ${task.id}`);
      assert.ok(Array.isArray(task.etiketler) && task.etiketler.length >= 1, `Expected tags in ${task.id}`);
      assert.ok(task.zorluk >= 1 && task.zorluk <= 5);
      assert.ok(task.sure_dk >= 1 && task.sure_dk <= 20);
    }

    for (const lightDay of [7, 14, 21]) {
      const lt = areaTasks[lightDay - 1];
      assert.ok(lt.etiketler.includes('hafif-gun'), `Expected hafif-gun tag on ${lt.id}`);
    }
  }
});

test('public/favicon.svg exists, index.html links it, and unused stock assets are pruned', () => {
  const svgFaviconPath = path.join(rootDir, 'public', 'favicon.svg');
  assert.equal(fs.existsSync(svgFaviconPath), true, 'Expected public/favicon.svg to exist');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.match(indexHtml, /href="\/favicon\.svg"/);

  assert.equal(fs.existsSync(path.join(rootDir, 'public', 'assets')), false, 'Expected unused public/assets directory to be removed');
  assert.equal(fs.existsSync(path.join(rootDir, 'public', 'logo-dark.png')), false, 'Expected unused public/logo-dark.png to be removed');
  assert.equal(fs.existsSync(path.join(rootDir, 'public', 'logo-light.png')), false, 'Expected unused public/logo-light.png to be removed');
});

