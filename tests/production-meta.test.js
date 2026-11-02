import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

test('index.html includes web manifest, theme-color, canonical, and Open Graph / Twitter tags', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /rel="manifest"\s+href="\/manifest\.webmanifest"/);
  assert.match(html, /rel="canonical"\s+href="https:\/\/gunden-gune\.vercel\.app\/"/);
  assert.match(html, /name="theme-color"[^>]+#F7F4EE/);
  assert.match(html, /name="theme-color"[^>]+#161513/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:description"/);
  assert.match(html, /property="og:image"\s+content="https:\/\/gunden-gune\.vercel\.app\/favicon-512\.png"/);
  assert.match(html, /name="twitter:card"\s+content="summary"/);
});

test('vercel.json, robots.txt, sitemap.xml, and GitHub Actions CI workflow are properly configured', () => {
  const vercelRaw = fs.readFileSync(path.join(root, 'vercel.json'), 'utf8');
  const vercelCfg = JSON.parse(vercelRaw);
  assert.ok(Array.isArray(vercelCfg.headers) && vercelCfg.headers.length >= 2);

  const swRule = vercelCfg.headers.find(h => h.source === '/sw.js');
  assert.ok(swRule, 'Expected explicit /sw.js header rule in vercel.json');
  const swCache = swRule.headers.find(h => h.key.toLowerCase() === 'cache-control');
  assert.match(swCache.value, /max-age=0/);

  assert.equal(fs.existsSync(path.join(root, 'public', 'robots.txt')), true);
  assert.equal(fs.existsSync(path.join(root, 'public', 'sitemap.xml')), true);

  const ciYaml = fs.readFileSync(path.join(root, '.github', 'workflows', 'ci.yml'), 'utf8');
  assert.match(ciYaml, /npm test/);
  assert.match(ciYaml, /npm run build/);
});
