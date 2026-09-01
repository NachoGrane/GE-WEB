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
  /**
   * Qué escuchar concretamente: le da al visitante algo puntual en qué fijarse
   * y es lo que separa una demo de un argumento.
   *
   * Es opcional a propósito. Mientras esté vacío el reproductor simplemente no
   * muestra la línea: preferible eso a inventar una descripción de una mezcla,
   * que es justo el texto donde se nota si quien escribe escuchó o no.
   */
  queEscuchar?: string;
  /** Extensiones disponibles en public/audio/ para este slug. */
  formatos: string[];
};

const definiciones: Comparativa[] = [
  {
    slug: 'el-manuscrito',
    titulo: 'El Manuscrito',
    artista: 'Lautaro',
    genero: 'Heavy metal',
    formatos: ['m4a'],
  },
  {
    slug: 'yus-brillos',
    titulo: 'Brillos',
    artista: 'Yus',
    genero: 'Pop',
    // PENDIENTE: completar.
    formatos: ['m4a'],
  },
  {
    slug: 'popo-deper-armonia',
    titulo: 'Armonía diferente',
    artista: 'Popo Deper',
    genero: 'Rock progresivo',
    // PENDIENTE: completar.
    formatos: ['m4a'],
  },
  {
    slug: 'nacho-tuscanciones',
    titulo: 'Tus canciones',
    artista: 'Nax feat. Mochi',
    genero: 'Pop',
    // PENDIENTE: completar.
    formatos: ['m4a'],
  },
  {
    slug: 'mochi-atrasdelsol',
    titulo: 'Atrás del sol',
    artista: 'Mochi',
    genero: 'Música popular',
    // PENDIENTE: completar.
    formatos: ['m4a'],
  },
];

/** Lo que mide `npm run picos` para cada par de audios. */
export type DatosMedidos = {
  duracion: number;
  picos: number[];
  lufs: { before: number; after: number };
};

export type ComparativaCompleta = Comparativa &
  DatosMedidos & {
    /**
     * Ganancia a aplicar a cada rama para que las dos suenen al mismo nivel.
     * Ver `igualarSonoridad`.
     */
    ganancia: { before: number; after: number };
  };

/**
 * Calcula la ganancia que deja las dos versiones a la misma sonoridad.
 *
 * Importa mucho: si el "después" está más fuerte, siempre va a sonar mejor, y
 * la comparación deja de decir nada sobre la mezcla. Se iguala hacia abajo,
 * atenuando la rama más fuerte y nunca amplificando, para no arriesgar recortes.
 */
function igualarSonoridad(lufs: { before: number; after: number }) {
  const objetivo = Math.min(lufs.before, lufs.after);
  const ganancia = (valor: number) => Number(Math.pow(10, (objetivo - valor) / 20).toFixed(4));
  return { before: ganancia(lufs.before), after: ganancia(lufs.after) };
}

/** Une los textos con los datos medidos. Descarta las que no fueron analizadas. */
export const comparativas: ComparativaCompleta[] = definiciones.flatMap((def) => {
  const medido: DatosMedidos | undefined = (picos as Record<string, DatosMedidos>)[def.slug];
  if (!medido) {
    console.warn(`[comparativas] falta analizar "${def.slug}": corré npm run picos`);
    return [];
  }
  return [{ ...def, ...medido, ganancia: igualarSonoridad(medido.lufs) }];
});
