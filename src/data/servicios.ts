/**
 * Servicios que ofrece el estudio.
 *
 * Agregar un servicio nuevo (mastering, por ejemplo) es agregar un objeto acá.
 * Con eso solo aparecen automáticamente:
 *   - la tarjeta en la sección Servicios
 *   - la opción en el desplegable del formulario de contacto
 *   - el bloque Service en los datos estructurados para Google
 * No hay que tocar ningún componente.
 */

export type Servicio = {
  /** Identificador estable; se usa en anclas y en el formulario. */
  slug: string;
  nombre: string;
  /** Una línea que aclara para quién es. */
  resumen: string;
  /** Precio de referencia, en pesos. null muestra "a cotizar". */
  desde: number | null;
  moneda: 'ARS';
  incluye: string[];
  /** Resalta la tarjeta como opción sugerida. Solo una debería tenerlo. */
  destacado?: boolean;
};

export const servicios: Servicio[] = [
  {
    slug: 'mezcla',
    nombre: 'Mezcla',
    resumen: 'Para el artista que ya grabó y quiere que su tema suene terminado.',
    // PENDIENTE: precio real.
    desde: null,
    moneda: 'ARS',
    incluye: [
      'Hasta 40 pistas',
      '2 rondas de revisión',
      'Entrega en WAV 24 bits y MP3',
      'Versiones instrumental y a capela',
    ],
    destacado: true,
  },
  {
    slug: 'mezcla-stems',
    nombre: 'Mezcla por stems',
    resumen: 'Cuando ya tenés una premezcla armada y buscás terminación y pegada.',
    // PENDIENTE: precio real.
    desde: null,
    moneda: 'ARS',
    incluye: [
      'Hasta 12 stems',
      '1 ronda de revisión',
      'Entrega en WAV 24 bits y MP3',
      'Entrega rápida',
    ],
  },
];

/** Formatea el precio para mostrar. */
export function precioDesde(servicio: Servicio): string {
  if (servicio.desde === null) return 'A cotizar';
  return `Desde $${servicio.desde.toLocaleString('es-AR')}`;
}
