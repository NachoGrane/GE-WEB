/**
 * Los pasos de trabajo. Es la sección que responde la pregunta que todo
 * artista se hace antes de contratar: "¿cómo es trabajar con esta persona?".
 *
 * Textos borrador para revisar con Ignacio.
 */

export type Paso = {
  numero: string;
  titulo: string;
  detalle: string;
};

export const proceso: Paso[] = [
  {
    numero: '01',
    titulo: 'Hablamos del tema',
    detalle:
      'Me contás qué buscás, me pasás referencias y escucho el material. Antes de tocar ' +
      'un fader quiero entender adónde querés llegar con la canción.',
  },
  {
    numero: '02',
    titulo: 'Preparás y enviás',
    detalle:
      'Te paso una guía simple para exportar las pistas. Si algo llega mal grabado o ' +
      'incompleto te aviso antes de empezar, no después.',
  },
  {
    numero: '03',
    titulo: 'Mezclo y revisamos',
    detalle:
      'Recibís una primera versión con tiempo para escucharla tranquilo. Las revisiones ' +
      'están incluidas: la mezcla se termina cuando vos decís que está.',
  },
  {
    numero: '04',
    titulo: 'Entrega',
    detalle:
      'Te llevás los archivos finales en WAV y MP3, más instrumental y a capela para ' +
      'que puedas usarlos en vivo, en redes o donde los necesites.',
  },
];
