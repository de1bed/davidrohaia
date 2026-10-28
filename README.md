# David Rocha

Sitio personal multipágina con tres recorridos: mirar historias, resolver con productos y leer Mini Libros propios nacidos de los videos.

## Desarrollo

Requiere Node.js 22 o posterior. No necesita instalar dependencias.

```sh
npm run build
npm run dev
```

Abre http://127.0.0.1:4173/.

## Contenido y diseño

- `scripts/content.mjs`: proyectos y artículos.
- `scripts/experience.mjs`: mapa, contexto de productos y películas, Mini Libros y redes.
- `scripts/youtube-snapshot.mjs`: catálogo público de respaldo, generado con `npm run sync:youtube`.
- `scripts/pages.mjs`: plantillas de las páginas y componentes compartidos.
- `public/experience.css` y `public/experience.js`: recorridos, descubrimientos, filtros y redes flotantes.
- `public/styles.css` y `public/script.js`: diseño compartido, menú y reproductor.
- `public/assets/`: firma original, retrato e imágenes reales de los proyectos.
- `worker/feed.mjs`: catálogo obtenido de las pestañas públicas Videos y Shorts, complementado con RSS cuando está disponible. Caché de dos minutos; si YouTube falla se muestra un estado explícito de respaldo. No requiere credenciales de la cuenta. Los formatos públicos pueden cambiar: hay pruebas para los renderizadores y para la caída del RSS.

El newsletter ofrece lectura de la primera edición y solicitudes de invitación por correo. No hay un proveedor de envíos automáticos configurado.

Las notas son textos editoriales preparados a partir de las fuentes enlazadas. Mini Libros muestra ediciones propias en preparación, video de origen e índices provisionales; no anuncia descargas todavía inexistentes. Las imágenes definitivas de producto quedan pendientes de los archivos del propietario.

## Verificación y publicación

```sh
npm test
npm run build
```

El build produce las páginas estáticas para revisión local y un Worker ESM con los archivos integrados para Sites. `dist/` es salida generada. Se conserva la identidad de hosting en `.openai/hosting.json`.

Canal: https://www.youtube.com/@davidrochaia

Gallos Media: https://gallosmedia.com/
