// CSS Coffee — build de produção.
// Uso: npm install && npm run build   →   gera a pasta dist/ pronta para publicar.
import { transform } from 'esbuild';
import { readFile, writeFile, mkdir, cp, rm, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const SRC = 'src', OUT = 'dist';
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const read = (f) => readFile(path.join(SRC, f), 'utf8');

const jsSource = (await Promise.all(['js/levels.js', 'js/i18n.js', 'js/game.js'].map(read))).join('\n;\n');
const cssSource = (await read('css/style.css')).replaceAll('../fonts/', 'fonts/').replaceAll('../images/', 'images/');
const hash = createHash('sha256').update(jsSource + cssSource + (await read('index.html'))).digest('hex').slice(0, 8);
const version = `${pkg.version}-${hash}`;

const js = (await transform(jsSource.replaceAll('__VERSION__', version), { minify: true, target: ['chrome80', 'safari13', 'firefox78'] })).code;
const css = (await transform(cssSource, { loader: 'css', minify: true, target: ['chrome80', 'safari13'] })).code;

let html = await read('index.html');
html = html
  .replace(/<!--(?!CSS|JS)[\s\S]*?-->/g, '')
  .replace(/^\s+/gm, '')
  .replace(/\n+/g, '\n')
  .replace('<!--CSS-->', () => `<style>${css}</style>`)
  .replace('<!--JS-->', () => `<script>${js}</script>`);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, 'index.html'), html);
for (const item of ['fonts', 'images', 'app-icons', '.well-known', 'favicon.ico', 'manifest.webmanifest', 'privacy.html', 'robots.txt', 'screenshots', '.nojekyll', '.htaccess']) {
  await cp(path.join(SRC, item), path.join(OUT, item), { recursive: true });
}

// Lista de arquivos para o cache offline
async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = path.join(dir, name);
    if ((await stat(full)).isDirectory()) out.push(...await walk(full));
    else out.push(path.relative(OUT, full).split(path.sep).join('/'));
  }
  return out;
}
const assets = ['./', ...(await walk(OUT)).filter((f) => !f.startsWith('.well-known') && f !== '.htaccess' && f !== '.nojekyll' && !f.endsWith('.svg') || f === 'app-icons/icon.svg')
  .filter((f) => !f.includes('og-image') && !f.startsWith('screenshots/') && f !== 'robots.txt' && !f.endsWith('.txt'))];
const sw = (await read('sw.js')).replaceAll('__VERSION__', version).replace('__ASSETS__', JSON.stringify(assets));
await writeFile(path.join(OUT, 'sw.js'), (await transform(sw, { minify: true })).code);

let total = 0;
for (const f of await walk(OUT)) total += (await stat(path.join(OUT, f))).size;
console.log(`CSS Coffee ${version} → ${OUT}/  (${(await walk(OUT)).length} arquivos, ${(total / 1024).toFixed(1)} KB)`);
console.log(`index.html: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB (CSS ${(css.length / 1024).toFixed(1)} KB + JS ${(js.length / 1024).toFixed(1)} KB embutidos)`);
