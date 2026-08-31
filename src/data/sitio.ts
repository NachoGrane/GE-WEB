/**
 * Datos del sitio. Única fuente de verdad para contacto, redes y metadatos.
 *
 * Si cambia el número de WhatsApp, el email o un texto de SEO, se cambia acá
 * y se actualiza en toda la página.
 */

export const sitio = {
  nombre: 'Grané Estudio',
  dominio: 'https://graneestudio.com.ar',

  // Lo que hace el negocio hoy. Si mañana suma mastering, esto se amplía.
  titulo: 'Grané Estudio — Mezcla musical profesional',
  descripcion:
    'Mezcla musical para artistas y productores. Más de 10 años y 100 canciones ' +
    'mezcladas. Escuchá el antes y el después, y pedí tu presupuesto por WhatsApp.',

  autor: {
    nombre: 'Ignacio Grané',
    rol: 'Ingeniero de mezcla y productor musical',
    aniosExperiencia: 10,
    cancionesMezcladas: 100,
  },

  ubicacion: {
    ciudad: 'La Plata',
    provincia: 'Buenos Aires',
    pais: 'AR',
    // Trabaja a distancia: es tan importante como la ciudad para el SEO.
    alcance: 'Argentina y todo el mundo, de forma remota',
  },

  contacto: {
    whatsapp: '5492213531354',
    whatsappVisible: '+54 9 221 353-1354',
    email: 'estudiograne@gmail.com',
  },

  redes: {
    instagram: 'https://instagram.com/graneestudio',
    spotify: 'https://open.spotify.com/playlist/7uYuRVRZWiuVyfJP9Sowqs',
  },

  /**
   * Clave de Web3Forms del formulario de contacto.
   *
   * Va escrita acá y no en un secreto del repositorio a propósito: es pública
   * por diseño, viaja dentro del HTML de cualquier formulario de Web3Forms y lo
   * único que hace es dirigir el envío a la casilla de Ignacio. Guardarla como
   * secreto daría una falsa sensación de protección y sumaría un motivo más
   * para que el deploy falle en silencio.
   *
   * La variable de entorno permite apuntar a otra casilla para probar sin tocar
   * el código.
   */
  // Se usa || y no ??: una variable de entorno definida pero vacía (lo que pasa
  // si el entorno la declara sin valor) tiene que caer igual en la clave real.
  // Con ?? el formulario se publicaría sin clave y fallaría en silencio.
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || '9f5e9bd1-fbc3-41a4-8eae-fafc8bdd819c',
} as const;

/**
 * Arma un enlace a WhatsApp con un mensaje distinto según desde dónde se hizo
 * click. No es lo mismo quien viene del hero que quien viene de un servicio:
 * el mensaje precargado le ahorra a Ignacio la primera pregunta.
 */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${sitio.contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
