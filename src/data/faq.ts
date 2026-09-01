/**
 * Preguntas frecuentes.
 *
 * Cumplen dos funciones: sacan del medio las objeciones que frenan una consulta,
 * y alimentan el bloque FAQPage de datos estructurados, que es lo que hace que
 * Google pueda mostrar las preguntas desplegadas en los resultados.
 *
 * Las respuestas conviene que sean completas y en una sola pieza: Google no
 * indexa bien respuestas que dependen de leer otra parte de la página.
 *
 * Textos borrador para revisar con Nacho.
 */

export type Pregunta = {
  pregunta: string;
  respuesta: string;
};

export const faq: Pregunta[] = [
  {
    pregunta: '¿Trabajás a distancia?',
    respuesta:
      'Sí. La mayoría de los proyectos los hago de forma remota: me enviás las pistas por ' +
      'Drive o WeTransfer y trabajamos por WhatsApp y mail. Estoy en La Plata, así que si ' +
      'estás cerca y preferís pasar por el estudio, también se puede.',
  },
  {
    pregunta: '¿Cómo tengo que exportar las pistas?',
    respuesta:
      'En WAV de respetando los bits y frecuencia de muestreo utilizados para grabar, todas desde el mismo punto de inicio del proyecto, sin efectos ' +
      'de master y sin que ninguna pista llegue a saturar/clippear. Cuando arrancamos te paso una ' +
      'guía con el paso a paso para tu programa. Si tenés dudas, mandame el proyecto y lo ' +
      'revisamos juntos antes de que exportes.',
  },
  {
    pregunta: '¿Cuántas revisiones incluye?',
    respuesta:
      'En la ' +
      'práctica trabajo hasta que la mezcla esté bien: las rondas son para ordenar el ' +
      'proceso, no para cortarlo por la mitad.',
  },
  {
    pregunta: '¿Cuánto tarda?',
    respuesta:
      'Una mezcla toma entre cinco y diez días hábiles desde que recibo el material ' +
      'completo, según la agenda del momento y la cantidad de pistas. Si tenés una fecha ' +
      'de lanzamiento, decímela cuando escribas y te confirmo si llego.',
  },
  {
    pregunta: '¿Qué diferencia hay entre mezcla y mastering?',
    respuesta:
      'La mezcla trabaja sobre todas las pistas por separado: define el balance, el espacio ' +
      'y el carácter de la canción. El mastering es el paso siguiente y trabaja sobre la ' +
      'mezcla ya terminada como una sola pieza, para dejarla lista para las plataformas. ' +
      'Hoy el estudio se enfoca en la mezcla.',
  },
  {
    pregunta: '¿Qué pasa si no me gusta cómo quedó?',
    respuesta:
      'Para eso están las revisiones. Escuchás la primera versión, me decís con tus palabras ' +
      'qué te cierra y qué no, y lo ajusto. No hace falta que sepas términos técnicos: ' +
      'traducir "quiero que pegue más" a decisiones concretas es parte de mi trabajo.',
  },
];
