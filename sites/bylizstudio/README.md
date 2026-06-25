# ByLizstudio — Static Website

A polished, single-page static marketing site for **ByLizstudio**, a boutique nail-art studio in Cedar Park, TX, owned by nail artist Lismary.

## Stack

Plain **HTML / CSS / vanilla JS** — no framework, no build step, no `npm install`. The page opens directly in any modern browser.

```
sites/bylizstudio/
├─ index.html    # markup — all sections (anchor-nav single page)
├─ styles.css    # design system + responsive layout (CSS custom properties)
└─ script.js     # mobile nav toggle, menu close-on-tap/Escape, dynamic year
```

## Preview

Simply open the file in a browser:

```bash
open sites/bylizstudio/index.html        # macOS
xdg-open sites/bylizstudio/index.html    # Linux
```

Or serve it locally (recommended, so the Google Maps embed loads cleanly):

```bash
cd sites/bylizstudio
python3 -m http.server 8000
# visit http://localhost:8000
```

## Sections

1. **Sticky header** — wordmark, anchor nav, "Book on Booksy" CTA, mobile hamburger.
2. **Hero** — salon name, tagline, 5.0 · 17 reviews trust signal, Book CTA.
3. **About Lismary** — warm narrative on detail and client care.
4. **Services** — Manicure, Acrylic Fill, Pedicure, and signature Custom Nail Art.
5. **Gallery** — CSS-rendered palette tiles with descriptive alt text (no external images).
6. **Reviews** — 5.0 · 17 reviews highlight with representative testimonial cards.
7. **Booking CTA band** — prominent Booksy call to action.
8. **Location & Hours** — address, by-appointment hours, Google Maps embed + directions link.
9. **Footer** — brand, Booksy + directions links, copyright.

## Booking

All booking/CTA links point to the studio's Booksy profile and open in a new tab:
<https://booksy.com/en-us/1566411_bylizstudio_nail-salon_37606_cedar-park>

## Design notes

- **Palette:** blush rose `#E8B4B8` / deeper rose `#C9788A`, champagne gold `#C9A86A` / `#D4AF7A`, warm cream `#FAF4EF` / `#FDF8F4`, deep plum text `#3A2E32`, soft mauve `#D8BFC8` — defined as CSS custom properties.
- **Typography:** Cormorant Garamond (display serif) + Inter (body sans) via Google Fonts.
- Generous whitespace, soft rounded cards, subtle shadows, gold hairline accents, gentle hover transitions. Mobile-first responsive; body text uses deep plum on light for strong contrast.

## Business facts (source of truth)

- **Name:** ByLizstudio · nail-art studio
- **Owner:** Lismary
- **Address:** 17205 N Mount Rushmore Dr, Cedar Park, TX 78613
- **Rating:** 5.0 · 17 reviews (presented honestly)
- **Booking:** by appointment via Booksy only
- Prices shown are clearly labeled illustrative placeholders.

