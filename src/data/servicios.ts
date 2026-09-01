/**
 * Servicios que ofrece el estudio.
 *
 * Agregar un servicio nuevo (mastering, por ejemplo) es agregar un objeto acá.
 * Con eso solo aparecen automáticamente:
 *   - la tarjeta en la sección Servicios
 *   - la opción en el desplegable del formulario de contacto, que se muestra
 *     recién cuando hay más de un servicio
 *   - el bloque Service en los datos estructurados para Google
 * No hay que tocar ningún componente.
 */

export type Servicio = {
  /** Identificador estable; se usa en anclas y en el formulario. */
  slug: string;
  nombre: string;
  /** Una línea que aclara para quién es. */
  resumen: string;
  /**
   * Precio de referencia. Se muestra en las dos monedas porque hay clientes
   * dentro y fuera del país. null muestra "a cotizar".
   */
  desde: { ars: number; usd: number } | null;
  incluye: string[];
};

export const servicios: Servicio[] = [
  {
    slug: 'mezcla',
    nombre: 'Mezcla',
    resumen: 'Para el artista que ya grabó y quiere que su tema suene terminado.',
    desde: { ars: 90000, usd: 70 },
    incluye: [
      'Hasta 60 pistas',
      'Sin límite de revisiones',
      'Entrega en WAV y MP3',
      'Archivo preparado para masterizar donde gustes'
    ],
  },
];

/** El precio listo para mostrar, en las dos monedas. */
export function precioDesde(servicio: Servicio): { principal: string; alterno?: string } {
  if (servicio.desde === null) return { principal: 'A cotizar' };
  return {
    principal: `Desde $${servicio.desde.ars.toLocaleString('es-AR')}`,
    alterno: `o USD ${servicio.desde.usd}`,
  };
}
