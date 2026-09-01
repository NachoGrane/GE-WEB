/**
 * Convierte el logo vectorial de Grané Estudio (.ai) a SVG limpio.
 *
 * Los archivos .ai de Illustrator son PDF por dentro. Este script encuentra los
 * streams de contenido, los descomprime, interpreta los operadores de dibujo de
 * PDF (m/l/c/h/re/cm/q/Q) y los reescribe como un único <path> de SVG.
 *
 * Hay que correrlo una sola vez; el resultado se commitea en public/logo/.
 * Se conserva en el repo para poder regenerar los SVG si cambia la marca.
 *
 *   node scripts/extraer-logo.mjs
 */

import { inflateSync } from 'node:zlib';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const AI =
  'C:/Users/Nacho/Desktop/NachoG/Grané Estudio/GRAFICA GRANE ESTUDIO/logo grane vectorial.ai';

/**
 * Los streams del .ai, en orden. Identificados inspeccionando el archivo.
 *
 * En el logotipo, los subtrazados 0 a 3 son el marco romboidal: un anillo
 * (rectángulo exterior + interior) que en el original está duplicado. Los
 * subtrazados 4 en adelante son las letras.
 *
 *   logotipo.svg             marco + letras, se descarta el anillo repetido
 *   logotipo-sin-marco.svg   solo las letras, como se usa en Instagram
 */
const MARCA = '#8E8816';

const PIEZAS = [
  { stream: 0, salida: 'src/assets/logo/isotipo.svg', titulo: 'Isotipo Grané Estudio' },
  { stream: 3, salida: 'src/assets/logo/logotipo.svg', titulo: 'Grané Estudio', omitir: [2, 3] },
  {
    stream: 3,
    salida: 'src/assets/logo/logotipo-sin-marco.svg',
    titulo: 'Grané Estudio',
    omitir: [0, 1, 2, 3],
  },
  // El favicon se sirve como archivo suelto, así que necesita el color escrito:
  // no puede heredarlo por CSS como los que se incrustan en el HTML.
  {
    stream: 0,
    salida: 'public/favicon.svg',
    titulo: 'Grané Estudio',
    color: MARCA,
  },
];

/** Descomprime todos los streams FlateDecode del PDF. */
function leerStreams(buffer) {
  const streams = [];
  const marca = Buffer.from('stream');
  const cierre = Buffer.from('endstream');
  let i = 0;
  while ((i = buffer.indexOf(marca, i)) !== -1) {
    // "endstream" también contiene "stream": hay que descartar esas coincidencias.
    if (i >= 3 && buffer.subarray(i - 3, i).toString('latin1') === 'end') {
      i += marca.length;
      continue;
    }
    let inicio = i + marca.length;
    if (buffer[inicio] === 0x0d) inicio++;
    if (buffer[inicio] === 0x0a) inicio++;
    const fin = buffer.indexOf(cierre, inicio);
    if (fin === -1) break;
    try {
      streams.push(inflateSync(buffer.subarray(inicio, fin)));
    } catch {
      /* streams no comprimidos o binarios propios de Illustrator: se ignoran */
    }
    i = fin + cierre.length;
  }
  return streams;
}

/**
 * Interpreta un content stream de PDF y devuelve los subtrazados en coordenadas
 * de usuario. PDF tiene el eje Y hacia arriba; la conversión a SVG se hace después.
 */
function interpretar(texto) {
  const tokens = texto.split(/\s+/).filter(Boolean);
  const pila = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  const guardadas = [];
  const trazados = [];
  let actual = null;
  let cursor = [0, 0];

  // Aplica la matriz de transformación actual a un punto.
  const t = ([x, y]) => [ctm[0] * x + ctm[2] * y + ctm[4], ctm[1] * x + ctm[3] * y + ctm[5]];
  const num = (n) => Number(pila[pila.length - n]);

  for (const token of tokens) {
    if (/^-?[\d.]+$/.test(token)) {
      pila.push(token);
      continue;
    }

    switch (token) {
      case 'q':
        guardadas.push([...ctm]);
        break;
      case 'Q':
        ctm = guardadas.pop() ?? [1, 0, 0, 1, 0, 0];
        break;
      case 'cm': {
        const [a, b, c, d, e, f] = [num(6), num(5), num(4), num(3), num(2), num(1)];
        // Composición de matrices: nueva x actual
        ctm = [
          a * ctm[0] + b * ctm[2],
          a * ctm[1] + b * ctm[3],
          c * ctm[0] + d * ctm[2],
          c * ctm[1] + d * ctm[3],
          e * ctm[0] + f * ctm[2] + ctm[4],
          e * ctm[1] + f * ctm[3] + ctm[5],
        ];
        break;
      }
      case 'm':
        cursor = [num(2), num(1)];
        actual = { puntos: [{ tipo: 'M', p: [t(cursor)] }], cerrado: false };
        trazados.push(actual);
        break;
      case 'l':
        cursor = [num(2), num(1)];
        actual?.puntos.push({ tipo: 'L', p: [t(cursor)] });
        break;
      case 'c': {
        const c1 = [num(6), num(5)];
        const c2 = [num(4), num(3)];
        cursor = [num(2), num(1)];
        actual?.puntos.push({ tipo: 'C', p: [t(c1), t(c2), t(cursor)] });
        break;
      }
      case 'v': {
        // Curva con el primer control igual al punto actual
        const c2 = [num(4), num(3)];
        const fin = [num(2), num(1)];
        actual?.puntos.push({ tipo: 'C', p: [t(cursor), t(c2), t(fin)] });
        cursor = fin;
        break;
      }
      case 'y': {
        // Curva con el segundo control igual al punto final
        const c1 = [num(4), num(3)];
        const fin = [num(2), num(1)];
        actual?.puntos.push({ tipo: 'C', p: [t(c1), t(fin), t(fin)] });
        cursor = fin;
        break;
      }
      case 're': {
        const [x, y, w, h] = [num(4), num(3), num(2), num(1)];
        trazados.push({
          puntos: [
            { tipo: 'M', p: [t([x, y])] },
            { tipo: 'L', p: [t([x + w, y])] },
            { tipo: 'L', p: [t([x + w, y + h])] },
            { tipo: 'L', p: [t([x, y + h])] },
          ],
          cerrado: true,
        });
        actual = null;
        break;
      }
      case 'h':
        if (actual) actual.cerrado = true;
        break;
      case 'f':
      case 'f*':
      case 'F':
      case 'b':
      case 'B':
        actual = null;
        break;
    }

    if (!/^-?[\d.]+$/.test(token)) pila.length = 0;
  }

  return trazados;
}

/**
 * Descarta el rectángulo blanco que cubre toda la mesa de trabajo de 1200x1200.
 * Solo se elimina si coincide con la mesa completa: filtrar por "el rectángulo
 * más grande" borraría el marco del logotipo, que también es un rectángulo.
 */
const MESA = 1200;
function sinFondo(trazados) {
  return trazados.filter((tr) => {
    if (tr.puntos.length !== 4) return true;
    const xs = tr.puntos.flatMap((s) => s.p.map((p) => p[0]));
    const ys = tr.puntos.flatMap((s) => s.p.map((p) => p[1]));
    const cubreMesa =
      Math.min(...xs) <= 1 &&
      Math.min(...ys) <= 1 &&
      Math.max(...xs) >= MESA - 1 &&
      Math.max(...ys) >= MESA - 1;
    return !cubreMesa;
  });
}

function generarSVG(trazados, titulo, color = 'currentColor') {
  const xs = trazados.flatMap((tr) => tr.puntos.flatMap((s) => s.p.map((p) => p[0])));
  const ys = trazados.flatMap((tr) => tr.puntos.flatMap((s) => s.p.map((p) => p[1])));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const ancho = maxX - minX;
  const alto = maxY - minY;

  // PDF mide Y hacia arriba y SVG hacia abajo: se invierte y se lleva al origen.
  const r = (n) => Math.round(n * 100) / 100;
  const cx = (x) => r(x - minX);
  const cy = (y) => r(maxY - y);

  const d = trazados
    .map((tr) => {
      const partes = tr.puntos.map((s) => {
        if (s.tipo === 'M') return `M${cx(s.p[0][0])} ${cy(s.p[0][1])}`;
        if (s.tipo === 'L') return `L${cx(s.p[0][0])} ${cy(s.p[0][1])}`;
        return `C${s.p.map((p) => `${cx(p[0])} ${cy(p[1])}`).join(' ')}`;
      });
      return partes.join('') + 'Z';
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(ancho)} ${r(alto)}" role="img" aria-label="${titulo}"><path fill="${color}" fill-rule="nonzero" d="${d}"/></svg>\n`;
}

const buffer = readFileSync(AI);
const streams = leerStreams(buffer);

for (const pieza of PIEZAS) {
  let trazados = sinFondo(interpretar(streams[pieza.stream].toString('latin1')));
  if (pieza.omitir) trazados = trazados.filter((_, i) => !pieza.omitir.includes(i));
  const svg = generarSVG(trazados, pieza.titulo, pieza.color);
  const destino = resolve(process.cwd(), pieza.salida);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, svg);
  console.log(`${pieza.salida}  ${trazados.length} trazados  ${svg.length} bytes`);
}
