# David Rocha

Sitio de marca personal, en primera persona. Todo el texto vive en `scripts/content.mjs`.

- **Inicio**: un noticiero que rota (mi foto primero, luego el video más reciente del canal, productos, cortometrajes y el newsletter), Gallos Media y Vortex Lab con sus trabajos rotando, videos con etiquetas, redes (Instagram y TikTok), mini libros, newsletter y contacto.
- **Rutas**: `/lo-que-hago/`, `/productos/`, `/videos/`, `/mini-libros/`, `/newsletter/` y `/contacto/`.
- Diseño en `public/site.css`; comportamiento en `public/site.js`.

## Cómo actualizar el sitio

| Quiero cambiar… | Dónde |
| --- | --- |
| Titular, bajada, ubicación, foto | `profile` |
| Noticias del encabezado (agregar, quitar, ordenar) | `news`; cada `{kind: 'reels'}` muestra el siguiente par de `reels` en teléfonos |
| Título con gancho, mini opinión y etiqueta de un video | `videoNotes` (por id de YouTube) |
| Etiquetas automáticas de videos | `videoTags` |
| Trabajos que rotan en Desarrollo de IA y Producciones | `vortex.showcase`, `gallos.works` |
| Portafolio de /lo-que-hago/ | `portfolio` (tipos e items) |
| Agentes de IA (texto y enlace a Vortex Lab) | `agents` |
| Mini libros (portada, precio y enlace de compra) | `miniLibros.books` (`buyUrl` + `price` cambian el botón a "Comprar") |
| Opciones del formulario de contacto | `contactOptions` |
| Número de WhatsApp | `WHATSAPP_NUMBER` (hoy es un placeholder) |
| CTPatrol, NEXA VISIT, PrepIQ | `products` y los archivos `public/assets/*-app-0N.webp` |
| Newsletter (pasos y ejemplo) | `newsletter` |
| Redes | `socials` |
| Dónde ha aparecido el trabajo | `proof` |
| TikTok | `tiktok` (embed oficial del perfil: los videos más nuevos aparecen solos) |
| Instagram | `instagram`; las publicaciones aparecen solas al definir `INSTAGRAM_ACCESS_TOKEN` en Vercel |

Los videos del canal no se editan a mano: salen de YouTube y, si no responde, de `scripts/youtube-snapshot.mjs`.

## Newsletter

Los formularios piden correo y a qué te dedicas, y envían a `/api/subscribe`. No hay un proveedor nuevo. Cuando exista uno, configura **una** de estas variables en Vercel:

- **Beehiiv**: `BEEHIIV_API_KEY` y `BEEHIIV_PUBLICATION_ID`. El oficio viaja en `utm_content`.
- **Buttondown**: `BUTTONDOWN_API_KEY`. El oficio viaja en `notes`.

Mientras no haya proveedor, el formulario abre un correo ya escrito para no perder a la persona.

Para las vistas previas al compartir, define `SITE_URL` si usas un dominio propio.

## Desarrollo

Requiere Node.js 22. No necesita dependencias.

```sh
npm test
npm run build
npm run dev
```

Abre http://127.0.0.1:4173/.

`npm run build` y `npm run build:vercel` generan el mismo `dist/` estático. El hosting anterior de Sites ya no se empaqueta.
