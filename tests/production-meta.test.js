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

test('SEO/GEO audit requirements: valid WebApplication JSON-LD, raw HTML H1 fallback, clean W3C sitemap, HSTS, and llms.txt', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  // 1. Valid JSON-LD structured data with WebApplication & WebSite
  const ldMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(ldMatch, 'Expected <script type="application/ld+json"> in index.html');
  const parsedLd = JSON.parse(ldMatch[1]);
  assert.equal(parsedLd['@context'], 'https://schema.org');
  assert.ok(Array.isArray(parsedLd['@graph']), 'Expected @graph array in JSON-LD');
  const webApp = parsedLd['@graph'].find(n => n['@type'] === 'WebApplication');
  assert.ok(webApp, 'Expected WebApplication node in JSON-LD');
  assert.equal(webApp.name, 'Günden Güne');
  assert.equal(webApp.url, 'https://gunden-gune.vercel.app/');
  assert.equal(webApp.offers?.price, '0');

  // 2. OG/Twitter image accessibility metadata + pre-JS H1 & citable content inside #app
  assert.match(html, /property="og:image:alt"/);
  assert.match(html, /name="twitter:image:alt"/);
  const appBlock = html.match(/<div id="app">([\s\S]*?)<\/div>\s*<script type="module"/);
  assert.ok(appBlock && /<h1[\s>]/i.test(appBlock[1]), 'Expected raw HTML <h1> inside #app for non-JS crawlers');

  // 3. Sitemap uses W3C <lastmod> and omits deprecated <priority> / <changefreq>
  const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  assert.doesNotMatch(sitemap, /<priority>/);
  assert.doesNotMatch(sitemap, /<changefreq>/);

  // 4. HSTS security header in vercel.json
  const vercelCfg = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const globalHeaders = vercelCfg.headers.find(h => h.source === '/(.*)')?.headers || [];
  assert.ok(
    globalHeaders.some(h => h.key.toLowerCase() === 'strict-transport-security'),
    'Expected Strict-Transport-Security header in vercel.json'
  );

  // 5. Lighthouse-compliant public/llms.txt (H1 + > summary + Markdown links + 50+ chars)
  const llmsPath = path.join(root, 'public', 'llms.txt');
  assert.equal(fs.existsSync(llmsPath), true, 'Expected public/llms.txt to exist');
  const llmsTxt = fs.readFileSync(llmsPath, 'utf8');
  assert.match(llmsTxt, /^# Günden Güne/m);
  assert.match(llmsTxt, /\[.+?\]\(https:\/\/gunden-gune\.vercel\.app\/.*?\)/);
  assert.ok(llmsTxt.length >= 100);
});
