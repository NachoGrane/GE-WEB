/**
 * Comparativas A/B entre la premezcla y la mezcla terminada.
 *
 * Los textos se editan acá. Los datos medidos de cada audio (duración, picos de
 * la forma de onda y sonoridad) se generan aparte con `npm run picos` y viven en
 * picos.json, así regenerarlos nunca pisa lo que escribiste.
 *
 * Para agregar una comparativa:
 *   1. Dejá los dos archivos en public/audio/ como <slug>.before.m4a y
 *      <slug>.after.m4a (ver formatos más abajo).
 *   2. Corré `npm run picos`.
 *   3. Agregá el objeto acá con el mismo slug.
 */

import picos from './picos.json';

/**
 * Formatos de audio, en el orden en que los ofrece el reproductor. El navegador
 * usa el primero que entiende.
 *
 * El m4a (AAC) es el que funciona en todos lados, Safari y iPhone incluidos.
 * El webm queda como alternativa para Chrome y Firefox. Safari no reproduce
 * Vorbis ni Opus dentro de webm, así que sin el m4a no hay audio en iPhone.
 */
export const FORMATOS = [
  { extension: 'm4a', mime: 'audio/mp4; codecs="mp4a.40.2"' },
  { extension: 'webm', mime: 'audio/webm' },
] as const;

export type Comparativa = {
  slug: string;
  titulo: string;
  /** Artista, cuando hay permiso para nombrarlo. Si no, se omite y va solo el género. */
  artista?: string;
  genero: string;
  /** Qué escuchar concretamente. Le da al visitante algo puntual en qué fijarse. */
  queEscuchar: string;
  /** Extensiones disponibles en public/audio/ para este slug. */
  formatos: string[];
};

const definiciones: Comparativa[] = [
  {
    slug: 'el-manuscrito',
    titulo: 'El Manuscrito',
    artista: 'Lautaro',
    genero: 'Heavy metal',
    // PENDIENTE: revisar con Ignacio. Es el texto que le dice al visitante en
    // qué fijarse, y él va a ser mucho más preciso que este borrador.
    queEscuchar:
      'Fijate cómo la voz se sostiene por encima del muro de guitarras sin gritar, y ' +
      'cómo el bombo y el bajo pasan de una masa confusa a dos cosas distintas que se ' +
      'pueden seguir por separado.',
    formatos: ['m4a', 'webm'],
  },
];

/** Lo que mide `npm run picos` para cada par de audios. */
export type DatosMedidos = {
  duracion: number;
  picos: number[];
  lufs: { before: number; after: number };
};

export type ComparativaCompleta = Comparativa & DatosMedidos;

/** Une los textos con los datos medidos. Descarta las que no fueron analizadas. */
export const comparativas: ComparativaCompleta[] = definiciones.flatMap((def) => {
  const medido: DatosMedidos | undefined = (picos as Record<string, DatosMedidos>)[def.slug];
  if (!medido) {
    console.warn(`[comparativas] falta analizar "${def.slug}": corré npm run picos`);
    return [];
  }
  return [{ ...def, ...medido }];
});
