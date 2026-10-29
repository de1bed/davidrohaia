# David Rocha

Sitio de marca personal. El texto vive en `scripts/content.mjs`. La página cuenta una historia: cine con IA en Gallos Media, agentes y productos en Vortex Lab, la página web y el diseño, y la forma de pensar de David en YouTube.

## Cómo actualizar el sitio

| Quiero cambiar… | Dónde |
| --- | --- |
| Titular, bajada, ubicación | `profile` |
| Número de WhatsApp | `WHATSAPP_NUMBER` (hoy es un placeholder) |
| Gallos Media, Lunáticos TV, Vortex Lab | `gallos`, `vortex` |
| CTPatrol, NEXA VISIT, PrepIQ | `products` y los archivos `public/assets/*-app-0N.webp` |
| Mini libros y newsletter | `miniLibros`, `newsletter` |
| Redes | `socials` |

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
