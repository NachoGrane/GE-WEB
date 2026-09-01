# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

Landing page de una sola página para **Grané Estudio**, el servicio de mezcla musical de Nacho
Grané. El sitio y sus comentarios están en español rioplatense (voseo); mantené esa voz al escribir
texto visible o comentarios nuevos.

## Comandos

```bash
npm run dev        # servidor de desarrollo
npm run build      # astro check && astro build  (el chequeo de tipos corre antes de compilar)
npm run preview    # sirve dist/ ya compilado
npm run picos      # analiza public/audio/ y regenera src/data/picos.json
```

No hay framework de tests. La verificación es `npm run build` (que incluye `astro check`) más las
comprobaciones manuales de la sección **Verificación** al final.

Scripts de un solo uso, no incluidos en `npm run build`:

```bash
node scripts/extraer-logo.mjs      # regenera los SVG del logo desde el .ai
node scripts/generar-imagenes.mjs  # regenera public/og.png y apple-touch-icon.png
```

## Arquitectura

**La regla que ordena todo el proyecto: el contenido editable vive en `src/data/`, tipado. Ningún
texto, precio, link ni pregunta se escribe dentro de un componente.** Si vas a cambiar una palabra
visible, casi siempre el archivo correcto está en `src/data/`, no en `src/sections/`.

```
src/data/       sitio.ts servicios.ts comparativas.ts proceso.ts faq.ts + picos.json (generado)
src/sections/   una por sección de la landing, en el mismo orden que se ven
src/components/ Navegacion, PieDePagina, WhatsAppFlotante, ReproductorAB + ui/ (Boton, Campo, TituloSeccion)
src/scripts/    reproductor-ab.ts — el único JavaScript de peso del sitio
src/lib/        schema.ts — construye el JSON-LD desde src/data/
src/layouts/    Base.astro — <head>, metadatos, datos estructurados
src/styles/     global.css — tokens de marca y utilidades
```

`src/pages/index.astro` compone las secciones; el orden de esa lista **es** el argumento de venta
(qué ofrezco → escuchalo → cuánto sale → cómo trabajo → trayectoria → contacto).

### Agregar un servicio (por ejemplo, mastering)

Está diseñado para que sea agregar datos, no escribir código. Un objeto nuevo en
[src/data/servicios.ts](src/data/servicios.ts) genera solo:

- la tarjeta en la sección Servicios
- la opción del desplegable "Qué necesitás" del formulario de contacto
- el bloque `Service` del JSON-LD

No hace falta tocar ningún componente. Los assets de marca ya incluyen un lockup "PRODUCCIÓN" por si
más adelante se abre esa rama.

### El reproductor A/B

Es la pieza central del sitio y tiene una decisión de diseño que **no hay que romper**: las dos
versiones se reproducen **al mismo tiempo y sincronizadas**, y alternar solo cruza el volumen entre
una y otra. Nunca se pausa ni se reinicia. Un reproductor que arranca de cero al cambiar de versión
no sirve para comparar mezclas, que es el único motivo por el que existe la sección.

El ruteo es `<audio> → MediaElementSource → GainNode → salida`, en
[src/scripts/reproductor-ab.ts](src/scripts/reproductor-ab.ts). El `AudioContext` se crea recién en
el primer play porque los navegadores no permiten iniciarlo sin un gesto del usuario. La deriva se
corrige solo sobre la rama muda: ajustar la que se escucha se oiría como un salto.

La forma de onda se dibuja con picos calculados de antemano por `npm run picos`, para no decodificar
audio en el navegador solo para mostrar un gráfico.

### Audio: formatos y sonoridad

`npm run picos` mide la **sonoridad integrada en LUFS según ITU-R BS.1770-4** de cada archivo y
avisa si el `before` y el `after` difieren más de 1 LU. Esto importa: si el "después" está más
fuerte, siempre va a sonar mejor y la comparación deja de ser honesta.

Además el reproductor **iguala la sonoridad en la reproducción**: `igualarSonoridad()` en
[src/data/comparativas.ts](src/data/comparativas.ts) calcula, a partir de las mediciones, una
ganancia por rama que deja las dos versiones al mismo nivel. Iguala siempre hacia abajo —atenúa la
más fuerte, nunca amplifica— para no arriesgar recortes. Es lo que permite publicar pares que no
vinieron perfectamente igualados sin que la comparación mienta. No lo saques: sin eso el "después"
gana por volumen y la sección deja de probar nada.

Los archivos van en `public/audio/` como `<slug>.before.<ext>` y `<slug>.after.<ext>`. El orden de
formatos está en `FORMATOS` en [src/data/comparativas.ts](src/data/comparativas.ts):

- **`.m4a` (AAC) es el que hace falta para Safari y iPhone.** Safari no reproduce Vorbis en ningún
  contenedor, ni Opus dentro de WebM.
- `.webm` sirve como alternativa para Chrome y Firefox.

Los archivos publicados son fragmentos cortos de baja tasa a propósito: no existe forma de proteger
audio en un navegador, así que la protección real es no publicar nada que valga la pena copiar.

### Estilos

Tailwind 4 configurado enteramente en `@theme` dentro de
[src/styles/global.css](src/styles/global.css) — **no hay `tailwind.config`**.

El olivo `#8E8816` es el color exacto extraído de los originales de la marca. Los contrastes medidos
están documentados en un comentario del mismo archivo; el resumen es que el olivo puro no se usa
para texto chico (5.36:1) y para eso existe `--color-marca-clara` (8.53:1).

Los SVG del logo en `src/assets/logo/` **están generados** desde `logo grane vectorial.ai` por
`scripts/extraer-logo.mjs`, que interpreta los operadores de dibujo del PDF que hay dentro del .ai.
No los edites a mano: si cambia la marca, se regeneran. El isotipo se verificó contra el PNG
original con una diferencia del 0,05 % de píxeles.

### Aparición al hacer scroll

Resuelta 100 % en CSS con `animation-timeline: view()`, sin JavaScript. **Está escrita a propósito
de forma que nunca pueda dejar la página en blanco**: la animación existe solo dentro de un
`@supports`, así que un navegador que no la soporte simplemente muestra el contenido. No la
reemplaces por un patrón que ponga `opacity: 0` esperando que JavaScript lo encienda — si ese JS
falla, la página entera desaparece.

## Deploy

Push a `main` → GitHub Actions → GitHub Pages, dominio propio `graneestudio.com.ar`
([public/CNAME](public/CNAME); tiene que estar en `public/` para entrar en el artefacto publicado).
El trabajo diario va en ramas; mergear a `main` es la acción de deploy.

La clave de Web3Forms del formulario está escrita en `src/data/sitio.ts`, no en un secreto: es
pública por diseño y viaja dentro del HTML igual. La variable `PUBLIC_WEB3FORMS_KEY` existe solo
para desviar los envíos a otra casilla mientras se prueba (ver [.env.example](.env.example)).

## Presupuesto de performance

Primera carga medida: **~90 KB** (25 KB de HTML+CSS+JS comprimidos, 65 KB de fuentes). El audio pesa
cero hasta que alguien toca play (`preload="none"`). Si una modificación empuja esto bastante más
arriba, replanteala.

## Pendientes de contenido

Están marcados con `PENDIENTE` en el código. Queda uno solo:

- los textos de "qué escuchar" de las comparativas (`comparativas.ts`). El de El Manuscrito es un
  borrador y los otros cuatro están vacíos; los va completando Nacho. El campo es opcional a
  propósito: mientras esté vacío el reproductor no muestra la línea, que es preferible a inventar
  una descripción de una mezcla que no se escuchó.

Mientras las tarjetas no tengan todas ese texto, las de una misma fila quedan con distinto alto y
la grilla deja un hueco abajo en las más cortas. Se resuelve solo a medida que se completen.

## Verificación

- `npm run build` limpio (incluye el chequeo de tipos).
- Sin scroll horizontal en 360 / 390 / 768 / 1280 / 1920 px. El desborde suele venir de elementos
  decorativos posicionados en absoluto; el hero ya lleva `overflow-x-clip` por ese motivo.
- El comparador A/B: al alternar versión no se reinicia, no se pausa y las dos ramas quedan a menos
  de 50 ms una de otra.
- Recorrer la página con Tab: el foco siempre visible y el reproductor operable sin mouse.
- Validar el JSON-LD con el Rich Results Test de Google.
