# David Rocha

Sitio de marca personal: quién soy, productos con demo, el newsletter Señal IA (suscripción directa), videos que se actualizan solos desde YouTube, Mini Libros y una página para empresas (`/trabajemos/`).

## Cómo actualizar el sitio

Casi todo se edita en `scripts/content.mjs`:

| Quiero cambiar… | Dónde |
| --- | --- |
| Titular, descripción, ubicación | `profile` |
| Enlace para agendar llamadas (Calendly, Cal.com) | `profile.calendarUrl` |
| "Ahora mismo" (en qué estoy trabajando) | `now` — actualízalo cada mes |
| Lugares donde ha aparecido mi trabajo | `proof` |
| Texto, frecuencia y pasos del newsletter | `newsletter` |
| VortexLab IA, Gallos Media | `ventures` |
| Servicios para empresas | `services` |
| Agregar un producto | `projects` (y su contexto en `audiences`, `scripts/experience.mjs`) |
| Redes sociales | `socials` |

Los videos no se editan a mano: se leen del canal en vivo. Después de un cambio: `npm test && npm run build` y sube a `main`.

## Newsletter (suscripción)

Los formularios envían a `/api/subscribe` (`api/subscribe.js`). Configura **uno** de estos proveedores en Vercel → Settings → Environment Variables:

- **Beehiiv**: `BEEHIIV_API_KEY` y `BEEHIIV_PUBLICATION_ID`.
- **Buttondown**: `BUTTONDOWN_API_KEY`.

Mientras no haya proveedor, el formulario no pierde al suscriptor: le abre un correo ya escrito para que lo confirme por email.

Para las vistas previas al compartir por WhatsApp/LinkedIn, el build usa el dominio de producción de Vercel; si usas un dominio propio, define `SITE_URL` (por ejemplo `https://davidrocha.com`).

## Desarrollo

Requiere Node.js 22 (la versión configurada para producción). No necesita instalar dependencias.

```sh
npm run build
npm run dev
```

Abre http://127.0.0.1:4173/.

## Contenido y diseño

- `scripts/content.mjs`: marca personal, proyectos y artículos.
- `scripts/brand.mjs`: inicio, proyectos, newsletter y trabajemos.
- `public/brand.css` y `public/brand.js`: sistema visual de la marca y formularios del newsletter.
- `scripts/experience.mjs`: mapa, contexto de productos y películas, Mini Libros y redes.
- `scripts/youtube-snapshot.mjs`: catálogo público de respaldo, generado con `npm run sync:youtube`.
- `scripts/pages.mjs`: plantillas de las páginas y componentes compartidos.
- `public/experience.css` y `public/experience.js`: recorridos, descubrimientos, filtros y redes flotantes.
- `public/styles.css` y `public/script.js`: diseño compartido, menú y reproductor.
- `public/assets/`: firma original, retrato e imágenes reales de los proyectos.
- `worker/feed.mjs`: catálogo obtenido de las pestañas públicas Videos y Shorts, complementado con RSS cuando está disponible. Caché de dos minutos; si YouTube falla se muestra un estado explícito de respaldo. No requiere credenciales de la cuenta. Los formatos públicos pueden cambiar: hay pruebas para los renderizadores y para la caída del RSS.

Las notas son textos editoriales preparados a partir de las fuentes enlazadas. Mini Libros muestra ediciones propias en preparación, video de origen e índices provisionales; no anuncia descargas todavía inexistentes. Las imágenes definitivas de producto quedan pendientes de los archivos del propietario.

## Verificación y publicación

```sh
npm test
npm run build
```

El build produce las páginas estáticas para revisión local y un Worker ESM con los archivos integrados para Sites. `dist/` es salida generada y se limpia en cada build. Se conserva la identidad de hosting en `.openai/hosting.json`.

## Vercel

La integración con GitHub despliega `main`. `vercel.json` configura automáticamente:

- Framework: **Other** (`null`).
- Build Command: `npm run build:vercel`.
- Output Directory: `dist`.
- Node.js: **22.x**.

En el panel de Vercel, Root Directory debe ser la raíz del repositorio (`.`), donde están `package.json` y `vercel.json`.

El build de Vercel publica las 18 páginas y sus recursos directamente en el CDN; excluye el Worker y los metadatos de Sites. Las rutas, como `/proyectos/` y `/mini-libros/`, tienen su propio `index.html`; no se usa un fallback de SPA que oculte páginas inexistentes.

`api/subscribe.js` registra suscriptores en el proveedor configurado (ver arriba).

`api/youtube.js` es una función Node independiente: reutiliza el catálogo público de YouTube, tiene un límite de 30 segundos y comparte respuestas durante 60 segundos en el CDN. Si YouTube no responde, entrega el catálogo de respaldo con `stale: true` y una caché menor. No necesita API keys ni variables de entorno. El contenido de respaldo permite compilar sin conexión a YouTube.

Para comprobar la salida antes de subirla:

```sh
npm test
npm run build:vercel
npm run dev
```

Si el proyecto ya tenía overrides manuales en Vercel, comprueba que Root Directory sea la raíz del repositorio. No selecciones `dist` como raíz; esa carpeta se genera durante el build.

Canal: https://www.youtube.com/@davidrochaia

Gallos Media: https://gallosmedia.com/
