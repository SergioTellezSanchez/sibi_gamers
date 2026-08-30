# SIBI GAMERS — Documento Maestro del Proyecto

> Última actualización: 3 de agosto de 2026
> Este documento se actualiza al final de cada sesión de trabajo.
> Vive en la raíz del repo y es la única fuente de verdad del proyecto.

---

## 1. La marca

- **Nombre:** Sibi Gamers
- **Significado:** *Sibi* = fuego, lumbre en jñatjo (mazahua), la lengua de la comunidad de Yeyo. En la cosmovisión mazahua el fuego es uno de los elementos venerados del universo.
- **Historia de marca (para el About):** fundado por Yeyo, gamer mazahua de México. El nombre honra sus raíces: el sitio es una fogata (gosivi) donde los gamers se reúnen a compartir.
- **Idioma del sitio:** inglés
- **Pendiente:** verificar dominios (sibigamers.gg, sibigamers.com, playsibi.com, sibi.gg) y handles de redes sociales. Consultar con hablantes de la comunidad los matices de la palabra *sibi* en la variante local.

## 2. Concepto del portal

Portal de videojuegos con tres pilares de contenido y un diferenciador central:

1. **Rankings con score agregado (sección principal):** como albumoftheyear.org pero de videojuegos. Se toman calificaciones de tantas fuentes como sea posible y se agregan en un score 0–100 por juego, con transparencia de fuentes ("based on N sources").
2. **Noticias** (automatizadas/asistidas con Claude).
3. **Reseñas y guías**, con guías profundas de juegos importantes (hueco que GameFAQs deja descubierto).

**Diferenciadores:**
- Imágenes de juegos y noticias descargables en alta calidad (feature central, no accesorio).
- Recomendador con IA: el usuario describe qué quiere jugar en lenguaje natural y recibe 5 recomendaciones enlazadas a sus páginas de juego.
- Marca con identidad cultural real (jñatjo/mazahua).

## 3. Identidad visual

**Vibe:** oscuro editorial (tipo AOTY/Backloggd), sofisticado, data-driven. Ni neón gamer ni retro.

**Paleta (el fuego de Sibi):**

| Hex | Nombre | Uso |
|---|---|---|
| #03071E | Ink Black | Fondo principal |
| #370617 | Night Bordeaux | Superficies secundarias / cards |
| #6A040F | Black Cherry | Bordes, hovers |
| #9D0208 | Oxblood | Scores 0–49 |
| #D00000 | Brick Ember | Scores 0–49, alertas |
| #DC2F02 | Red Ochre | Scores 50–69 |
| #E85D04 | Cayenne Red | Scores 50–69, CTAs secundarios |
| #F48C06 | Deep Saffron | Scores 70–84, links |
| #FAA307 | Orange | Scores 85–100 |
| #FFBA08 | Amber Flame | Scores 85–100, CTA primario, marca |

**Decisiones de diseño tomadas:**
- Score: número grande 0–100 coloreado según la paleta (rojo = malo → ámbar = excelente).
- Home dominada por el ranking: top 3 en cards grandes con portada, posiciones 4–20 en tabla densa editorial.
- Tipografía: display bold en títulos, sans moderna en texto y tablas.
- Columna secundaria: Latest News + Recent Reviews.
- Banda destacando "Download all game art & screenshots in high quality".

## 4. Roadmap

### Fase 1 — Definición y validación (en curso)
- [x] Concepto, secciones y diferenciadores
- [x] Nombre: Sibi Gamers
- [x] Paleta de colores y dirección visual
- [ ] Verificar dominio y redes sociales
- [ ] **Investigación de oportunidades:** pasar una tarde en OpenCritic y Backloggd anotando qué funciona y qué estorba; completar la lista de "cosas que nadie hace" (sección 7)
- [ ] Definir fuentes de datos para el score agregado (críticos, tiendas, comunidad) y una metodología transparente

### Fase 2 — Diseño (Claude Design)
- [x] **Design system** (logo de flama geométrica estilo bordado mazahua, tokens, tipografía, componentes, motion GSAP) — completado
- [x] Homepage — completada (top 3 + tabla 4-20 con metadata rica, recomendador, noticias, reviews, banda de descargas)
- [x] **Página de detalle de juego** — canvas en `.design/`, dirección A (Broadsheet) elegida, implementada en código
- [x] ~~Plantilla de artículo (noticia/reseña/guía)~~ — **resuelto en código**, no pasa
      por Claude Design (ver registro de decisiones, Ago 2026)
- [x] ~~Módulo del recomendador IA~~ — resuelto dentro del diseño de la home (`PromptBox`); el endpoint es de Fase 3

### Fase 3 — Desarrollo (Claude Code)
- [x] **Stack decidido: Astro + islas React + GSAP** (ver §11 y registro de decisiones)
- [x] Homepage implementada sobre el design system
- [x] Índices de Reviews / News / Guides — **construidos code-first**, no pasaron por Claude Design. Consumen estrictamente los tokens y componentes de `src/ds/`. Se pueden empujar a Claude Design vía `/design-sync` para pulido visual si hace falta.
- [x] Contenido editorial en Markdown (content collections de Astro)
- [x] Sistema de motion completo según §8b (count-up al entrar en viewport, barra que se expande en hover, flicker del logomark)
- [x] **Páginas de detalle de artículo** para reviews, noticias y guías (`[slug].astro`),
      con migas, prev/next, JSON-LD por tipo y `og:type=article`. El sitio pasó de 4 a
      38 páginas rastreables; los 34 artículos en Markdown ya son alcanzables
- [x] **Pase cross-device**: sin desbordamiento horizontal de 320px a 2560px (83 de 84
      combinaciones página×ancho limpias, la restante es 1px de redondeo), paso de 2
      columnas para tablet en el top 3, objetivos táctiles de 44px vía `pointer: coarse`,
      y el contenedor crece a 1440/1560px por encima de 1600/2100px
- [x] **Adapter de deploy** (`@astrojs/vercel`) — desplegado en https://sibi-gamers.vercel.app; ninguna ruta usa SSR todavía
- [x] **Sistema de score** (`src/lib/score/`) — normalización de cualquier escala a
      0-100 y agregados (media, mediana, histograma) derivados de las filas, nunca
      almacenados. 16 tests con `pnpm test`. Falta la curación de datos reales
- [x] **Endpoint `/api/recommend`** con la API de Claude (`claude-opus-5`, salida
      estructurada, esfuerzo bajo, caché del catálogo). Única ruta SSR. Sin
      `ANTHROPIC_API_KEY` en Vercel responde con el banco estático y lo dice; la
      clave hay que añadirla en el proyecto de Vercel
- [x] **Página de detalle de juego** (`/games/[slug]/`, 20 páginas) según la dirección A:
      key art, tira de score, desglose por fuente con histograma, rail con tienda /
      reseña / guías / noticias, galería, ficha y "más como este". JSON-LD
      `VideoGame` con `aggregateRating` solo cuando hay score publicado
- [x] **Página "How we score"** (`/how-we-score/`) que renderiza las mismas tablas que
      usa el código, para que no diverjan
- [x] **Catálogo único de juegos** (`GAMES` en `games.ts`): ranking, podio, páginas de
      juego, recomendador y conteo de fuentes derivan de él
- [ ] Base de datos de juegos alimentada por APIs (RAWG, IGDB) para metadata e imágenes
- [ ] Curación de scores reales (20-30 juegos, 10-15 outlets cada uno)
- [ ] Pipeline de contenido automatizado con Claude (noticias/borradores)

### Fase 4 — Contenido inicial
- [ ] 5–10 piezas antes del lanzamiento: 2–3 reseñas, noticias, 1 guía profunda
- [ ] Ritmo sostenible: 2–3 publicaciones por semana

### Fase 5 — Lanzamiento
- [ ] Dominio conectado, prueba móvil, analytics (Plausible o GA)
- [ ] Compartir en redes, Discords y comunidades

### Fase 6 — Crecimiento
- [ ] Publicación consistente; medir qué funciona
- [ ] Activar afiliados; ads solo cuando haya tráfico
- [ ] Nuevas features según datos, no impulsos

**Principio rector: lanzar mínimo y vivo antes que perfecto y guardado.**

## 5. Monetización

- **Afiliados de tiendas (motor principal):** Green Man Gaming, Fanatical, Humble Bundle Partner, CDKeys, Instant Gaming. Botones "Buy on…" en cada página de juego (modelo OpenCritic).
- **Amazon Associates:** ediciones físicas, consolas, accesorios; ideal en guías ("best controllers for…").
- **Display ads (después):** AdSense al inicio si acaso; Mediavine/Raptive cuando haya decenas de miles de sesiones mensuales. No ensuciar el diseño el día uno.
- La página de juego (score + botones de compra) es la máquina de ingresos; noticias y guías son el tráfico que la alimenta.

## 6. Sitios de referencia (dónde buscar ideas)

**Agregadores de score (competencia directa):**
- Metacritic — metacritic.com — el estándar del score 0–100 con color; aprender de su claridad, evitar su opacidad metodológica
- OpenCritic — opencritic.com — transparencia de fuentes y botones de compra afiliados; el más cercano a nuestro modelo

**Comunidad y catálogo:**
- Backloggd — backloggd.com — estética oscura editorial, listas y perfiles; "Letterboxd de videojuegos"
- HowLongToBeat — howlongtobeat.com — ejemplo de un solo dato bien ejecutado sosteniendo un sitio
- RAWG — rawg.io — base de datos con API pública (candidata a fuente de datos)
- IGDB — igdb.com — ídem, API de Twitch

**Editorial:**
- IGN — ign.com — portal completo: noticias + reseñas + guías
- GameSpot — gamespot.com — similar, buen manejo de video
- Polygon — polygon.com — voz editorial y de autor
- Eurogamer — eurogamer.net — periodismo de juegos europeo
- GameFAQs — gamefaqs.gamespot.com — domina guías, pero sin profundidad en juegos importantes (nuestro hueco)

**Inspiración de diseño:**
- albumoftheyear.org — el modelo original: densidad editorial, scores con color, rankings anuales

**A vigilar:**
- games.gg — competidor grande de descubrimiento con IA (y la razón por la que descartamos nombres tipo "gamers.gg")

## 7. Investigación: cosas que nadie está haciendo (primera tarea)

Hipótesis a validar mirando los sitios de la sección 6:

- [ ] Score agregado + alma editorial + comunidad en un solo sitio (nadie combina las tres)
- [ ] Imágenes oficiales en alta calidad, descargables y organizadas por juego
- [ ] Recomendaciones por intención en lenguaje natural ("algo como Hades pero más relajado")
- [ ] Guías profundas de juegos grandes con estándar editorial (vs. wikis caóticas)
- [ ] Rankings anuales vivos tipo AOTY ("Best Games of 2026" que se actualiza todo el año)
- [ ] Transparencia total de metodología del score (pesos y fuentes públicos)
- [ ] Añadir aquí lo que descubras en la investigación…

## 8. Prompt para Claude Design (homepage)

```
Design the homepage for "Sibi Gamers", a video game portal focused on aggregated
game ratings (think albumoftheyear.org but for video games), plus news, reviews,
and guides. "Sibi" means fire in Jñatjo (Mazahua), an indigenous language of
Mexico — the whole visual identity is built on fire: from ink black darkness to
ember reds to amber flame.

VISUAL DIRECTION
Dark editorial aesthetic: sophisticated, content-first, data-driven. Not
neon-gamer, not retro. Think a premium music/film criticism site adapted to gaming.

COLOR PALETTE (use exactly these)
- Ink Black #03071E — main background
- Night Bordeaux #370617 — secondary surfaces / cards
- Black Cherry #6A040F — subtle accents, borders, hover states
- Oxblood #9D0208 and Brick Ember #D00000 — low scores, alerts
- Red Ochre #DC2F02 and Cayenne Red #E85D04 — mid scores, secondary CTAs
- Deep Saffron #F48C06 — high scores, links
- Orange #FAA307 and Amber Flame #FFBA08 — top scores, primary CTA, brand highlights
Text: near-white on dark backgrounds, warm gray for secondary text.

TYPOGRAPHY
Bold display typeface for headlines and game titles; clean modern sans-serif for
body text, tables, and UI. Strong typographic hierarchy.

SCORE SYSTEM (core identity of the site)
Every game shows a large 0–100 numeric score. The number's color maps to the palette:
- 0–49: Oxblood/Brick Ember reds
- 50–69: Red Ochre/Cayenne
- 70–84: Deep Saffron
- 85–100: Amber Flame
Scores are aggregated from multiple external sources; show a small "based on N
sources" label under each score.

HOMEPAGE STRUCTURE (ranking is the protagonist)
1. Slim top navigation: Sibi Gamers logo (wordmark, consider a subtle flame motif),
   sections: Rankings, Reviews, News, Guides. Search bar.
2. Hero section: "Best Games of 2026" — the TOP 3 games as large cards with cover
   art, big colored score, title, platforms, and genre tags.
3. Below: ranked table (positions 4–20) in dense editorial style: rank number,
   small cover thumbnail, title, release date, platforms, colored score aligned
   right. Rows with subtle hover state.
4. A module: "What do you want to play?" — a natural-language input where users
   describe their mood and get 5 AI-powered recommendations.
5. Sidebar or secondary column: "Latest News" list with thumbnails and "Recent Reviews".
6. A small band highlighting a unique feature: "Download all game art & screenshots
   in high quality" with a download icon.
7. Footer: simple, dark, with section links and social icons.

DETAILS
- All content in English. Use realistic placeholder game data (invented titles are
  fine, do not use real copyrighted game art).
- Desktop-first layout but keep it responsive-friendly.
- Density inspired by albumoftheyear.org: lots of information, but breathable
  thanks to spacing and hierarchy, never cluttered.
```

## 8b. Prompt para Claude Design (design system — hacer PRIMERO)

```
Create a complete DESIGN SYSTEM for "Sibi Gamers", a video game portal centered on
aggregated game ratings (0-100 scores), plus news, reviews, and guides.

BRAND CONTEXT
"Sibi" means fire in Jñatjo (Mazahua), an indigenous language of central Mexico.
The founder is Mazahua. The entire identity is built on fire: from ink-black
darkness through ember reds to amber flame. The brand should feel culturally
rooted but contemporary — never folkloric or costume-like.

DESIGN PRINCIPLES
1. Simple and modern: no visual noise, no gamer clichés (no neon, no glitch, no RGB).
2. Dark editorial and data-first: content and numbers are the heroes.
3. Reference: albumoftheyear.org homepage — near-black background, minimal top nav
   (wordmark left, search right), small uppercase section headers with "VIEW ALL"
   links, dense grids of cover art, scores shown as plain numbers with a thin
   colored underline bar, muted gray secondary text, generous information density
   kept breathable by spacing, not decoration.
4. Motion with purpose: the site uses GSAP animations throughout — subtle,
   fast, and meaningful. Never decorative for its own sake.

LOGO
Design a flame logomark inspired by Mazahua geometric embroidery (eight-pointed
star patterns, stepped diamonds, zigzag lines). Requirements:
- A single flame silhouette constructed from simple geometric shapes — angular,
  stepped or faceted, echoing textile patterns. NOT a literal realistic flame,
  NOT overloaded with detail.
- Must work as: full lockup (mark + "SIBI GAMERS" wordmark), standalone mark,
  and 16px favicon.
- One color version in Amber Flame #FFBA08, one in near-white, one in Ink Black.
- Wordmark in the display typeface, tight tracking, all caps.

COLOR TOKENS (use exactly these)
Backgrounds & surfaces:
- bg/primary: Ink Black #03071E
- surface/card: Night Bordeaux #370617
- border & hover: Black Cherry #6A040F
Score scale (core of the brand — number and underline bar take this color):
- score/low (0-49): Oxblood #9D0208, Brick Ember #D00000
- score/mid (50-69): Red Ochre #DC2F02, Cayenne Red #E85D04
- score/high (70-84): Deep Saffron #F48C06
- score/top (85-100): Orange #FAA307, Amber Flame #FFBA08
Actions:
- primary CTA: Amber Flame #FFBA08 (dark text on top)
- links: Deep Saffron #F48C06
Text:
- primary: near-white #F5F3F0
- secondary: warm gray #9A938E
Include usage rules and accessibility notes (contrast on dark backgrounds).

TYPOGRAPHY
- Display: bold, condensed-leaning typeface for headlines, game titles, and the
  big score numbers. Suggest a specific Google Font.
- Body/UI: clean modern sans-serif for text, tables, labels. Suggest a pairing.
- Define the scale: h1-h4, body, caption, the small uppercase section header
  style (letter-spaced, like AOTY's "NEW RELEASES"), and the score number style
  (largest text on any page).

CORE COMPONENTS (show each in the system)
- Top navigation bar (wordmark left, links center: Rankings / Reviews / News /
  Guides, search input right)
- Score display: big colored number + thin colored underline bar + small
  "based on N sources" caption — in 3 sizes (hero, card, table row)
- Game card: cover art, title, platforms, genre tags, score
- Ranking table row: rank, thumbnail, title, date, platforms, score right-aligned
- Buttons: primary (amber), secondary (outline cherry), text link
- Input field and the "What do you want to play?" AI prompt box
- News list item: thumbnail, source label, headline
- Tags/chips for genres and platforms
- Footer

MOTION GUIDELINES (GSAP)
Define a small motion system to be used across the whole project:
- Durations: fast 0.2s (hovers), base 0.4s (reveals), slow 0.8s (hero)
- Easing: expo.out for entrances, power2.inOut for transitions
- Signature animations: score numbers count up from 0 when scrolled into view;
  section content reveals with a slight stagger (ScrollTrigger); cards lift
  subtly on hover with the underline bar expanding; the flame logomark has one
  discreet idle or hover animation (e.g., a gentle flicker via scale/skew).
- Rule: animations never block reading; everything works without them.

DELIVERABLE
A single design system sheet: logo variations, color tokens with hex labels,
type scale specimens, all components in default/hover states, and the motion
specs written as annotations. Dark background throughout. All labels in English.
```

## 8c. Prompt para Claude Design (página de detalle de juego)

```
Using the Sibi Gamers design system, design the GAME DETAIL PAGE — the most
important page of the site, where the aggregated score lives.

LAYOUT (top to bottom)
1. Hero: game cover art left; right side: title (display type), studio, release
   date, platforms, genre tags — and the score block: huge colored 0-100 number,
   thin colored underline, "based on N sources", plus a small "How we score" link.
2. Score breakdown (the AOTY signature, our core feature): a clean table listing
   every source: outlet name, original score in its native format (9/10, 4/5, B+),
   normalized 0-100 value in the score color, and an external-link icon to the
   original review. Below the table: a small histogram of the score distribution.
3. "Play on" row: store buttons (Steam, PS Store, Xbox, eShop, GOG, Epic) — these
   will carry affiliate links.
4. Media gallery: screenshots and key art grid with a "Download all in high
   quality" button and per-image download on hover.
5. About: short description, metadata table (studio, country, director, budget,
   length), and related guides & news for this game.
6. Bottom: "More like this" — 4 game cards.

MOTION (GSAP, per the design system)
Score counts up on load; breakdown rows stagger in; gallery images reveal on scroll.

Use invented placeholder data consistent with the homepage (e.g., Ashen Trials,
94, based on 51 sources). English. Desktop-first, responsive-friendly.
```

## 8d. Plan de datos (sistema de score)

> **Ya construido** en `src/lib/score/`. El modelo, las reglas de normalización
> publicables, los umbrales y lo que sigue faltando están en
> [SCHEMA.md](SCHEMA.md) §4. Lo de abajo es el plan original y se mantiene como
> registro de las restricciones de origen.

- **Metadata e imágenes:** IGDB API (vía cuenta dev de Twitch, gratis) + RAWG API. Alimentan nombres, portadas, screenshots, géneros, plataformas, estudios — y el feature de imágenes HQ.
- **Scores por fuente (MVP):** curación semiautomatizada de los 20-30 juegos top de 2026. Por juego: score de 10-15 outlets (IGN, GameSpot, PC Gamer, Eurogamer, Polygon…) + URL de la reseña original. Sin scraping masivo que viole ToS; los scores son datos factuales y siempre se enlaza a la fuente (modelo AOTY/OpenCritic). Respaldo: `aggregated_rating` de IGDB.
- **Normalización:** resuelta. 9/10 → 90 · 4/5 → 80 · letras sobre 95/85/75/65 para A/B/C/D con ±3 según el sufijo (B+ → 88) · **mínimo de 5 fuentes** para publicar score, igual que OpenCritic. Sin ponderación por outlet en el MVP.
- **Página "How we score":** metodología pública (fuentes, normalización, promedio). Bandera de transparencia contra la opacidad de Metacritic.
- **Pendiente:** crear cuentas en dev.twitch.tv (IGDB) y rawg.io/apidocs; definir modelo de datos (games, sources, reviews) antes de Claude Code.

## 11. Arquitectura técnica (estado actual del repo)

> Resumen. El detalle técnico vive en [ARCHITECTURE.md](ARCHITECTURE.md) y los
> esquemas de datos en [SCHEMA.md](SCHEMA.md); ahí se actualizan, no aquí.

**Stack: Astro 7 + islas React 19 + GSAP 3 + TypeScript.**

**Por qué Astro y no un SPA.** Este es un negocio de SEO: la página de juego es la
máquina de ingresos y las noticias y guías son el tráfico que la alimenta (§5). Un
SPA renderizado en cliente entrega al crawler un `<div>` vacío, un solo `<title>` y
un LCP lento — justo lo contrario de lo que el modelo necesita. Astro entrega HTML
completo por ruta, con su propio title, description y canonical, y solo hidrata las
piezas que de verdad tienen estado.

Medido en el build actual: **1.6–1.7 kB gz de JS** en las 37 páginas editoriales
(artículos e índices) frente a los 129 kB gz del SPA que se descartó. **La home es
la excepción: ~64 kB gz**, porque hidrata `RankingsBoard` con `client:load` y eso
pone el runtime de React en la ruta crítica. Sigue ganando al SPA, pero no es la
cifra de las otras 37. Detalle y palanca de mejora en [ARCHITECTURE.md](ARCHITECTURE.md) §4.

```
src/
  pages/            una ruta por archivo → HTML estático
    reviews/[slug]  · news/[slug] · guides/[slug] — detalle de artículo,
                    getStaticPaths sobre la colección; prev/next y JSON-LD
    games/[slug]    página de juego (dirección A); desglose por fuente,
                    histograma, JSON-LD VideoGame con aggregateRating
    how-we-score    las reglas de normalización, renderizadas desde el código
    api/recommend   la ÚNICA ruta SSR: Claude elige 5 juegos del catálogo
  layouts/Base      shell + <head> por página (title, description, canonical, OG)
  content/          reviews · news · guides en Markdown (content collections)
  content.config.ts esquemas Zod que validan el frontmatter en cada build
  ds/               design system portado del bundle de Claude Design
    tokens/         colors · typography · spacing · fonts — copiados literales
  components/       componentes .astro (cero JS en cliente)
    ArticleShell    migas + medida de lectura + prev/next, compartido por
                    las tres secciones; la cabecera llega por slot
  islands/          los ÚNICOS componentes React que se hidratan:
                      RankingsBoard  selector década/año + ranking
                      PromptBox      recomendador
  scripts/
    motion.ts       GSAP para todo el sitio, vía data-attributes
    filters.ts      filtros de Reviews/News/Guides sin framework (428 B gz)
  lib/score/        normalización + agregados; lib/recommend.ts, la parte pura del endpoint
  data/games.ts     el catálogo (20 juegos); todo lo demás deriva de él (futuro: IGDB/RAWG)
  data/outlets.ts   53 outlets y sus escalas
  data/scores.ts    133 filas placeholder de score por outlet, 3 juegos
```

**Reglas que sostienen la arquitectura:**

1. **Nada es isla salvo que tenga estado.** Animar no justifica hidratar: el markup
   estático se apunta al sistema de motion con `data-reveal`, `data-count`,
   `data-hover-lift`, `data-flame`.
2. **Los filtros no re-renderizan.** Todas las tarjetas se sirven en el HTML y el
   filtro solo alterna `hidden`. El crawler ve el catálogo completo, no el subconjunto
   que el filtro por defecto seleccione.
3. **El motion es estrictamente aditivo.** GSAP (44 kB gz) se importa dinámicamente
   en `requestIdleCallback`, y **no se descarga en absoluto** si el visitante pidió
   reduced-motion. Los scores traen su valor final en el HTML y los reveals solo hacen
   aparecer contenido: si el script nunca corre, la página está completa y correcta.
4. **Los tokens del design system no se editan a mano.** `src/ds/tokens/*.css` son
   copia literal del proyecto de Claude Design; re-sincronizar es reemplazar archivos.
   Los overrides de página viven en `src/styles/app.css`.
5. **Editorial en Markdown, datos de juego en TypeScript.** Reviews, noticias y guías
   son contenido y van en content collections. Juegos y scores son datos y saldrán de
   APIs (§8d), así que no se disfrazan de Markdown.

**Deuda conocida:**
- El recomendador está construido pero **sin clave en producción**: hasta que
  `ANTHROPIC_API_KEY` exista en Vercel, responde con el banco estático y el pie lo
  dice. Tampoco hay límite de peticiones por visitante; hay que ponerlo antes de
  anunciar la función.
- Los 133 scores por outlet son inventados y se atribuyen a publicaciones reales
  sobre juegos que no existen. La aritmética sí es real y está testeada; las filas
  no. Curar datos reales (20-30 juegos, 10-15 outlets cada uno) es trabajo manual
  que no ha empezado.
- `site` apunta a `sibigamers.gg`, dominio que aún no está conectado al deploy: todos
  los canonical y OG del sitio en vivo señalan a una URL que no resuelve. Aplazado a
  propósito; hay que resolverlo antes de pedir indexación.
- Todo el arte es placeholder: key art, galería y portadas son degradados. El botón
  "Download all in high quality" no hace nada hasta que existan assets.
- "Play on" lista tiendas como etiquetas; sin enlaces de afiliado ni precios todavía.
- El buscador de la barra envía a `/search`, ruta que no existe (404).
- "View all" / "Full rankings" en la home siguen en `#`: no hay página de ranking
  completo porque el catálogo entero ya es el top 20. Los iconos sociales del footer
  también siguen en `#` (Fase 1).
- Todo el copy (verdicts, headlines, guías, nombres de críticos) es placeholder
  inventado. Hay que reemplazarlo antes de cualquier lanzamiento.

## 9. Herramientas

- **Claude (este Proyecto):** planeación y seguimiento; la memoria del proyecto vive aquí
- **Claude Design:** identidad visual y mockups
- **Claude Code:** desarrollo del sitio
- **APIs candidatas:** RAWG, IGDB (datos e imágenes), Claude API (recomendador y contenido)

## 10. Registro de decisiones

| Fecha | Decisión |
|---|---|
| Jul 2026 | Nombre final: **Sibi Gamers** (sibi = fuego en jñatjo). Descartados: YGamers, yeyosgamers (slang en EU), AZGamers (lectura "Arizona"), gamers.gg (conflicto con games.gg) |
| Jul 2026 | Pilares: rankings agregados (principal), noticias, reseñas y guías |
| Jul 2026 | Diferenciadores: imágenes HQ descargables, recomendador IA, guías profundas |
| Jul 2026 | Diseño: oscuro editorial, score 0–100 coloreado, top 3 cards + tabla, display + sans, sitio en inglés |
| Jul 2026 | Monetización: afiliados en páginas de juego primero, ads después |
| Ago 2026 | **Stack: Astro + islas React + GSAP.** Razón: el negocio es SEO-first (§5), y un SPA cliente no entrega HTML rastreable ni meta por ruta. Se descartó un primer prototipo en Vite + React Router (129 kB gz de JS) y se portó antes de añadir páginas nuevas, mientras el costo de migración era bajo |
| Ago 2026 | Contenido editorial (reviews, noticias, guías) en Markdown vía content collections con esquemas Zod. Los datos de juegos siguen en TypeScript porque vendrán de IGDB/RAWG |
| Ago 2026 | Reviews / News / Guides se construyen **code-first** sobre el design system, sin esperar re-derivación en Claude Design. La página de detalle de juego SÍ pasa por Design→Code por ser la página de ingresos |
| Ago 2026 | **Plantilla de artículo en código, no en Claude Design.** Fase 2 la listaba como entregable de diseño, pero se resolvió por el precedente de los índices: lo editorial se construye code-first sobre el design system y solo la página de juego pasa por Design→Code. Desbloquea 34 artículos que ya existían en Markdown pero no tenían ruta |
| Ago 2026 | **Score mínimo de 5 fuentes para publicar**, igual que OpenCritic, y **sin ponderación por outlet** en el MVP (`weight` existe pero se ignora, para no migrar datos después). Una reseña revisada reemplaza a la original: una fila por outlet, gana la más reciente |
| Ago 2026 | **`sourceCount` deja de escribirse a mano.** Sale de `sourceCountFor()`, que cuenta filas reales, o no se renderiza. Los 17 juegos sin filas dejaron de mostrar un número inventado, y el campo salió del frontmatter de las reseñas: la reseña es un crítico, el agregado es del juego |
| Ago 2026 | **El recomendador nunca falla hacia el usuario.** Sin clave, con rate limit, con rechazo o con respuesta mal formada, devuelve el banco estático con `source: "bank"` y la isla lo etiqueta. Un fallback que parece real es una mentira; uno etiquetado es una degradación honesta |
| Ago 2026 | **El modelo solo redacta los motivos.** Los ids se validan contra el catálogo y título y score salen de ahí, no de la respuesta: el modelo no puede inventar un juego ni un número |
| Ago 2026 | **Un solo catálogo de juegos.** La identidad de un juego estaba repartida entre dos arrays en `games.ts`, el frontmatter de las reseñas y `scores.ts`, unidos por slug del título. Ahora `GAMES` es la única fuente y el `id` explícito es la clave de ruta y de score. Las reseñas siguen indexadas por título porque las escriben personas |
| Ago 2026 | **El key art de la página de juego llena el contenedor, no el viewport.** Un full-bleed real (`margin: calc(50% - 50vw)`) desborda por el ancho de la barra de scroll en todo SO que la dibuje, y el sitio garantiza cero desbordamiento horizontal |
| Ago 2026 | **"Mostrar las 51 fuentes" es un `<details>` nativo.** Todas las filas van en el HTML y nada hidrata: cumple los invariantes 1 y 2 sin excepción para la página de ingresos |
| Ago 2026 | **Gestor de paquetes: pnpm** (`packageManager` fijado, `pnpm-workspace.yaml` con `allowBuilds: esbuild`). Se descartó npm; el lockfile se regeneró desde cero |
| Ago 2026 | GSAP se carga en idle y no se carga con reduced-motion: el motion es aditivo, nunca requisito para leer |
