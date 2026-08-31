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
    // PENDIENTE confirmar: viene del proyecto anterior.
    whatsapp: '5492213531354',
    whatsappVisible: '+54 9 221 353-1354',
    // PENDIENTE: definir a qué casilla deben llegar las consultas.
    email: 'hola@graneestudio.com.ar',
  },

  redes: {
    // PENDIENTE: usuario real de Instagram.
    instagram: 'https://instagram.com/graneestudio',
    spotify: 'https://open.spotify.com/playlist/7uYuRVRZWiuVyfJP9Sowqs',
  },

  /**
   * Clave pública de Web3Forms para el formulario. Es pública por diseño:
   * identifica el formulario, no da acceso a nada.
   * PENDIENTE: generar en https://web3forms.com y pegar acá.
   */
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
} as const;

/**
 * Arma un enlace a WhatsApp con un mensaje distinto según desde dónde se hizo
 * click. No es lo mismo quien viene del hero que quien viene de un servicio:
 * el mensaje precargado le ahorra a Ignacio la primera pregunta.
 */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${sitio.contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
