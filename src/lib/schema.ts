/**
 * Datos estructurados (JSON-LD) para Google.
 *
 * Se arman desde los mismos archivos de src/data/ que alimentan la página, así
 * que no pueden quedar desincronizados con lo que el visitante ve. Eso importa:
 * Google penaliza los datos estructurados que describen algo que no está en la
 * página.
 */

import { sitio } from '@/data/sitio';
import { servicios } from '@/data/servicios';
import { faq } from '@/data/faq';

const ID_NEGOCIO = `${sitio.dominio}/#negocio`;
const ID_PERSONA = `${sitio.dominio}/#Nacho`;

/** El estudio como prestador de servicios. */
function negocio() {
  return {
    '@type': 'ProfessionalService',
    '@id': ID_NEGOCIO,
    name: sitio.nombre,
    url: sitio.dominio,
    description: sitio.descripcion,
    image: `${sitio.dominio}/og.png`,
    logo: `${sitio.dominio}/favicon.svg`,
    priceRange: '$$',
    founder: { '@id': ID_PERSONA },
    address: {
      '@type': 'PostalAddress',
      addressLocality: sitio.ubicacion.ciudad,
      addressRegion: sitio.ubicacion.provincia,
      addressCountry: sitio.ubicacion.pais,
    },
    // Trabaja a distancia: para Google es tan relevante como la ciudad.
    areaServed: [
      { '@type': 'Country', name: 'Argentina' },
      { '@type': 'AdministrativeArea', name: 'Global' },
    ],
    sameAs: [sitio.redes.instagram, sitio.redes.spotify],
    knowsLanguage: ['es-AR'],
  };
}

/** Nacho como profesional. Sostiene las búsquedas por su nombre. */
function persona() {
  return {
    '@type': 'Person',
    '@id': ID_PERSONA,
    name: sitio.autor.nombre,
    jobTitle: sitio.autor.rol,
    url: sitio.dominio,
    worksFor: { '@id': ID_NEGOCIO },
    knowsAbout: ['Mezcla musical', 'Producción musical', 'Audio profesional'],
  };
}

/** Un bloque por servicio, generado desde servicios.ts. */
function serviciosOfrecidos() {
  return servicios.map((servicio) => ({
    '@type': 'Service',
    '@id': `${sitio.dominio}/#servicio-${servicio.slug}`,
    name: servicio.nombre,
    description: servicio.resumen,
    serviceType: servicio.nombre,
    provider: { '@id': ID_NEGOCIO },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    // Una oferta por moneda: hay clientes dentro y fuera del país.
    ...(servicio.desde !== null && {
      offers: [
        { moneda: 'ARS', precio: servicio.desde.ars },
        { moneda: 'USD', precio: servicio.desde.usd },
      ].map(({ moneda, precio }) => ({
        '@type': 'Offer',
        priceCurrency: moneda,
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: precio,
          priceCurrency: moneda,
        },
      })),
    }),
  }));
}

/** Las preguntas frecuentes, que Google puede mostrar desplegables. */
function preguntas() {
  return {
    '@type': 'FAQPage',
    '@id': `${sitio.dominio}/#faq`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
    })),
  };
}

/** El grafo completo, listo para inyectar en un <script type="application/ld+json">. */
export function grafoJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      negocio(),
      persona(),
      ...serviciosOfrecidos(),
      preguntas(),
      {
        '@type': 'WebSite',
        '@id': `${sitio.dominio}/#sitio`,
        url: sitio.dominio,
        name: sitio.nombre,
        inLanguage: 'es-AR',
        publisher: { '@id': ID_NEGOCIO },
      },
    ],
  };
}
