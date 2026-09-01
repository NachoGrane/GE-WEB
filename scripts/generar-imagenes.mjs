/**
 * Genera las imágenes que no se pueden escribir a mano:
 *
 *   public/og.png              1200x630, la tarjeta que se ve al compartir el link
 *   public/apple-touch-icon.png  180x180, el ícono al agregar a pantalla de inicio
 *
 * Se arman renderizando HTML con Chrome, así usan la tipografía y el logo reales
 * en vez de una aproximación dibujada a mano.
 *
 *   node scripts/generar-imagenes.mjs
 */

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PUERTO = 9336;

const isotipo = readFileSync('src/assets/logo/isotipo.svg', 'utf8');
const logotipo = readFileSync('src/assets/logo/logotipo-sin-marco.svg', 'utf8');
const fuentes = pathToFileURL(resolve('public/fonts')).href;

/** Plantilla de la tarjeta para redes sociales. */
const og = readFileSync('scripts/plantillas/og.html', 'utf8')
  .replace('FUENTES', fuentes)
  .replace('FUENTES', fuentes)
  .replace('ISOTIPO', isotipo)
  .replace('LOGOTIPO', logotipo);

/** Ícono: el isotipo centrado sobre el negro de la marca. */
const icono = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0}
  body{width:180px;height:180px;background:#0a0a0a;display:grid;place-items:center}
  div{width:74px;color:#8e8816}
  svg{width:100%;display:block}
</style><div>${isotipo}</div>`;

const temporal = mkdtempSync(join(tmpdir(), 'img-'));
const escribirTemp = (nombre, html) => {
  const ruta = join(temporal, nombre);
  writeFileSync(ruta, html);
  return pathToFileURL(ruta).href;
};

const piezas = [
  { url: escribirTemp('og.html', og), ancho: 1200, alto: 630, salida: 'public/og.png' },
  {
    url: escribirTemp('icono.html', icono),
    ancho: 180,
    alto: 180,
    salida: 'public/apple-touch-icon.png',
  },
];

const perfil = mkdtempSync(join(tmpdir(), 'chrome-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${PUERTO}`,
    `--user-data-dir=${perfil}`,
    '--no-first-run',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

let objetivo;
for (let i = 0; i < 40 && !objetivo; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PUERTO}/json/list`);
    objetivo = (await r.json()).find((x) => x.type === 'page');
  } catch {}
  if (!objetivo) await esperar(250);
}
if (!objetivo)
  throw new Error('Chrome no respondió. Definí CHROME_PATH si no está en la ruta por defecto.');

const ws = new WebSocket(objetivo.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));

let id = 0;
const pendientes = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  const p = pendientes.get(m.id);
  if (p) {
    pendientes.delete(m.id);
    m.error ? p[1](new Error(JSON.stringify(m.error))) : p[0](m.result);
  }
});
const cmd = (method, params = {}) => {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method, params }));
  return new Promise((res, rej) => pendientes.set(i, [res, rej]));
};

await cmd('Page.enable');

for (const pieza of piezas) {
  await cmd('Emulation.setDeviceMetricsOverride', {
    width: pieza.ancho,
    height: pieza.alto,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cmd('Page.navigate', { url: pieza.url });
  await esperar(1200); // que terminen de cargar las fuentes
  const { data } = await cmd('Page.captureScreenshot', { format: 'png' });
  writeFileSync(pieza.salida, Buffer.from(data, 'base64'));
  console.log(`${pieza.salida}  ${pieza.ancho}x${pieza.alto}`);
}

ws.close();
chrome.kill();
rmSync(temporal, { recursive: true, force: true });
