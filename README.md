# David Rocha

Sitio personal multipágina: novedades, videos de YouTube, Gallos Media, productos, notas, newsletter y biblioteca.

## Desarrollo

Requiere Node.js 22 o posterior. No necesita instalar dependencias.

```sh
npm run build
npm run dev
```

Abre http://127.0.0.1:4173/.

## Contenido y diseño

- `scripts/content.mjs`: proyectos, videos de respaldo, artículos y selección editorial de libros.
- `scripts/pages.mjs`: plantillas de las páginas y componentes compartidos.
- `public/styles.css` y `public/script.js`: diseño, carrusel y reproductor.
- `public/assets/`: firma original, retrato e imágenes reales de los proyectos.
- `worker/feed.mjs`: feed público de YouTube, consultado y almacenado en caché durante 15 minutos. Si YouTube falla, se conserva la selección verificada.

El newsletter ofrece lectura de la primera edición y solicitudes de invitación por correo. No hay un proveedor de envíos automáticos configurado.

Las notas son textos editoriales preparados para este sitio a partir de las fuentes enlazadas. La biblioteca es una selección editorial inicial; no afirma que sean lecturas completadas por David.

## Verificación y publicación

```sh
npm test
npm run build
```

El build produce las páginas estáticas para revisión local y un Worker ESM con los archivos integrados para Sites. `dist/` es salida generada. Se conserva la identidad de hosting en `.openai/hosting.json`.

Canal: https://www.youtube.com/@davidrochaia

Gallos Media: https://gallosmedia.com/
