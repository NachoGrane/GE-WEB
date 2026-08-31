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
  genero: string;
  /** Qué escuchar concretamente. Le da al visitante algo puntual en qué fijarse. */
  queEscuchar: string;
  /** Extensiones disponibles en public/audio/ para este slug. */
  formatos: string[];
};

const definiciones: Comparativa[] = [
  {
    slug: 'el-manuscrito',
    // PENDIENTE: confirmar con Ignacio el nombre del tema, el artista (si hay
    // permiso para nombrarlo) y el género.
    titulo: 'El Manuscrito',
    genero: 'Rock',
    queEscuchar:
      'Fijate cómo aparece la voz al frente sin taparse con las guitarras, y cómo la ' +
      'batería gana cuerpo y definición.',
    formatos: ['webm'],
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
