# David Rocha

Sitio de marca personal. El texto vive en `scripts/content.mjs`. El inicio abre con un índice y se lee en dos partes:

1. **Lo que hace por una empresa**: 01 cine (Gallos Media), 02 agentes (Vortex Lab), 03 productos (CTPatrol, NEXA VISIT, PrepIQ, con pestañas y capturas reales), 04 páginas web.
2. **Lo que comparte**: 05 YouTube, 06 TikTok, 07 Mini libros, 08 Newsletter.

Cierra con contacto por WhatsApp. Diseño en `public/site.css`; comportamiento (videos en vivo, pestañas, galería, TikTok, formularios) en `public/site.js`.

## Cómo actualizar el sitio

| Quiero cambiar… | Dónde |
| --- | --- |
| Titular, bajada, ubicación | `profile` |
| Número de WhatsApp | `WHATSAPP_NUMBER` (hoy es un placeholder) |
| Gallos Media, Lunáticos TV, Vortex Lab | `gallos`, `vortex` |
| CTPatrol, NEXA VISIT, PrepIQ | `products` y los archivos `public/assets/*-app-0N.webp` |
| Mini libros y newsletter | `miniLibros`, `newsletter` |
| Redes | `socials` |
| Dónde ha aparecido el trabajo | `proof` |
| Sección de TikTok | `tiktok` (usa el embed oficial del perfil: los videos más nuevos aparecen solos) |

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
