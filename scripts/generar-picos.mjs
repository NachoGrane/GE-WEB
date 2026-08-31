/**
 * Analiza los pares de audio A/B de public/audio/ y genera:
 *   - los picos para dibujar la forma de onda (sin decodificar audio en el navegador)
 *   - la sonoridad integrada en LUFS de cada archivo, según ITU-R BS.1770-4
 *
 * La sonoridad importa: si el "después" está más fuerte que el "antes", siempre
 * va a sonar mejor y la comparación deja de ser honesta. Este script avisa
 * cuando la diferencia entre las dos versiones supera el margen aceptable.
 *
 *   npm run picos
 */

import decode from '@audio/decode';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'public/audio';
const SALIDA = 'src/data/picos.json';
const PICOS = 120; // columnas de la forma de onda
const TOLERANCIA_LU = 1.0; // diferencia aceptable entre before y after

/** Filtro biquad directo forma II traspuesta. */
function biquad(x, b0, b1, b2, a1, a2) {
  const y = new Float32Array(x.length);
  let z1 = 0;
  let z2 = 0;
  for (let i = 0; i < x.length; i++) {
    const s = x[i];
    y[i] = b0 * s + z1;
    z1 = b1 * s - a1 * y[i] + z2;
    z2 = b2 * s - a2 * y[i];
  }
  return y;
}

/**
 * Coeficientes del ponderado K de BS.1770 para cualquier frecuencia de muestreo.
 * La norma publica los valores para 48 kHz; estos se derivan del prototipo
 * analógico, así que a 48 kHz dan exactamente los mismos números.
 */
function ponderadoK(fs) {
  // Etapa 1: realce de agudos (~+4 dB por encima de 1,7 kHz)
  const f0 = 1681.974450955533;
  const G = 3.999843853973347;
  const Q = 0.7071752369554196;
  const K = Math.tan((Math.PI * f0) / fs);
  const Vh = Math.pow(10, G / 20);
  const Vb = Math.pow(Vh, 0.4996667741545416);
  const a0 = 1 + K / Q + K * K;
  const etapa1 = [
    (Vh + (Vb * K) / Q + K * K) / a0,
    (2 * (K * K - Vh)) / a0,
    (Vh - (Vb * K) / Q + K * K) / a0,
    (2 * (K * K - 1)) / a0,
    (1 - K / Q + K * K) / a0,
  ];

  // Etapa 2: pasaaltos de segundo orden a ~38 Hz
  const f0b = 38.13547087602444;
  const Qb = 0.5003270373238773;
  const Kb = Math.tan((Math.PI * f0b) / fs);
  const den = 1 + Kb / Qb + Kb * Kb;
  const etapa2 = [1, -2, 1, (2 * (Kb * Kb - 1)) / den, (1 - Kb / Qb + Kb * Kb) / den];

  return [etapa1, etapa2];
}

/** Sonoridad integrada en LUFS (ITU-R BS.1770-4). */
function lufs(canales, sampleRate) {
  const [etapa1, etapa2] = ponderadoK(sampleRate);
  const ponderados = canales.map((canal) => biquad(biquad(canal, ...etapa1), ...etapa2));

  // Bloques de 400 ms solapados al 75 %
  const largoBloque = Math.round(0.4 * sampleRate);
  const salto = Math.round(largoBloque / 4);
  const bloques = [];

  for (let inicio = 0; inicio + largoBloque <= ponderados[0].length; inicio += salto) {
    let suma = 0;
    for (const canal of ponderados) {
      let ms = 0;
      for (let i = inicio; i < inicio + largoBloque; i++) ms += canal[i] * canal[i];
      suma += ms / largoBloque; // ganancia 1.0 para izquierda y derecha
    }
    bloques.push({ potencia: suma, nivel: -0.691 + 10 * Math.log10(suma || 1e-12) });
  }

  if (!bloques.length) return -Infinity;

  // Compuerta absoluta en -70 LUFS
  const absoluta = bloques.filter((b) => b.nivel > -70);
  if (!absoluta.length) return -Infinity;

  // Compuerta relativa: 10 LU por debajo del promedio de lo que pasó la absoluta
  const media = absoluta.reduce((s, b) => s + b.potencia, 0) / absoluta.length;
  const umbral = -0.691 + 10 * Math.log10(media) - 10;
  const relativa = absoluta.filter((b) => b.nivel > umbral);
  if (!relativa.length) return -Infinity;

  const mediaFinal = relativa.reduce((s, b) => s + b.potencia, 0) / relativa.length;
  return -0.691 + 10 * Math.log10(mediaFinal);
}

/** Valor absoluto máximo por columna, normalizado a 0-100. */
function picos(canales, columnas) {
  const largo = canales[0].length;
  const porColumna = Math.floor(largo / columnas);
  const crudos = [];

  for (let c = 0; c < columnas; c++) {
    let max = 0;
    const inicio = c * porColumna;
    for (let i = inicio; i < inicio + porColumna; i++) {
      for (const canal of canales) {
        const v = Math.abs(canal[i]);
        if (v > max) max = v;
      }
    }
    crudos.push(max);
  }

  const tope = Math.max(...crudos) || 1;
  return crudos.map((v) => Math.round((v / tope) * 100));
}

function picoDb(canales) {
  let max = 0;
  for (const canal of canales) for (const v of canal) if (Math.abs(v) > max) max = Math.abs(v);
  return 20 * Math.log10(max || 1e-12);
}

const archivos = readdirSync(DIR).filter((f) => /\.(webm|m4a|mp3|ogg|wav|flac)$/i.test(f));
const pares = new Map();

for (const archivo of archivos) {
  const m = archivo.match(/^(.+)\.(before|after)\.\w+$/);
  if (!m) {
    console.warn(`omitido (no sigue <slug>.before|after.ext): ${archivo}`);
    continue;
  }
  const [, slug, lado] = m;
  if (!pares.has(slug)) pares.set(slug, {});
  pares.get(slug)[lado] = archivo;
}

const salida = {};

for (const [slug, lados] of pares) {
  console.log(`\n${slug}`);
  const medidas = {};

  for (const lado of ['before', 'after']) {
    if (!lados[lado]) {
      console.log(`   falta el archivo ${lado}`);
      continue;
    }
    const buffer = readFileSync(join(DIR, lados[lado]));
    const audio = await decode(buffer);
    // El decodificador devuelve { channelData, sampleRate }, no un AudioBuffer.
    const canales = audio.channelData;
    const sampleRate = audio.sampleRate;

    const medida = {
      archivo: lados[lado],
      duracion: canales[0].length / sampleRate,
      sampleRate,
      canales: canales.length,
      lufs: lufs(canales, sampleRate),
      pico: picoDb(canales),
      picos: picos(canales, PICOS),
    };
    medidas[lado] = medida;

    console.log(
      `   ${lado.padEnd(6)} ${medida.duracion.toFixed(2)}s  ${medida.sampleRate}Hz  ` +
        `${medida.canales}ch  ${medida.lufs.toFixed(2)} LUFS  pico ${medida.pico.toFixed(2)} dBFS`
    );
  }

  if (medidas.before && medidas.after) {
    const dif = medidas.after.lufs - medidas.before.lufs;
    const difDur = Math.abs(medidas.after.duracion - medidas.before.duracion);
    console.log(`   diferencia de sonoridad: ${dif > 0 ? '+' : ''}${dif.toFixed(2)} LU`);
    if (Math.abs(dif) > TOLERANCIA_LU) {
      console.log(
        `   >> ATENCION: la version "${dif > 0 ? 'after' : 'before'}" esta ` +
          `${Math.abs(dif).toFixed(2)} LU mas fuerte. Igualar antes de publicar.`
      );
    }
    if (difDur > 0.05) {
      console.log(`   >> ATENCION: las duraciones difieren en ${difDur.toFixed(2)}s.`);
    }

    salida[slug] = {
      duracion: Number(medidas.before.duracion.toFixed(2)),
      picos: medidas.before.picos,
      lufs: {
        before: Number(medidas.before.lufs.toFixed(2)),
        after: Number(medidas.after.lufs.toFixed(2)),
      },
    };
  }
}

writeFileSync(SALIDA, JSON.stringify(salida, null, 2) + '\n');
console.log(`\nEscrito ${SALIDA} con ${Object.keys(salida).length} comparativa(s).`);
