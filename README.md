# CLT website code

Source of truth for the custom CSS and JS on commonwealthlyrictheater.com (Webflow).
Anything that runs on the site should match a file here.

## Global

| File | Used by |
| --- | --- |
| `global/clt-master.css` | Design system. Site settings → Head code, via jsDelivr |
| `global/clt-core.js` | Curtain, Lenis, reveals, dialogs, lighting. Site settings → Footer code, via jsDelivr |
| `global/clt-mainnav.js` | Inline in the Main Nav component |
| `global/clt-form-tracking.js` | Site settings → Footer code, via jsDelivr |
| `global/clt-core.updated.js` | Legacy, no longer loaded anywhere; safe to delete |

## Pages

| File | Used by |
| --- | --- |
| `pages/<page>/<page>.css` | That page's Code Embeds |
| `pages/<page>/<page>.js` | That page → Before `</body>`, via jsDelivr pinned to the release tag (`.min.js`) |
| `pages/shared/performances.js` | Site settings → Footer code, via jsDelivr (Home + Events). One CMS item per showtime, merged back into one row per date. Tickets buttons go to `/tickets` only when `window.CLT_TICKETS_URL` is set |
| `pages/tickets/tickets.{js,css}` | /tickets → page head (CSS) and Before `</body>` (JS), via jsDelivr pinned to the release tag. Markup of its embeds: `pages/tickets/tickets.sections.html` |
| `pages/about-us/about-team-cms.js` | Inline in About → Before `</body>` |

## Tests and checks

- `node --test` — unit tests for the pure helpers (`tests/`).
- `node tools/check-tickets.mjs [--cdn] [--shots <dir>]` — staging /tickets: picker, desktop choice, deep link, phone sheet.
- `node tools/check-performances.mjs [--tickets] [--cdn] [--shots <dir>]` — loads staging Home and Events in headless Chrome
  with the local `performances.js` / `clt-master.css` swapped in (or as served with `--cdn`) and prints each date row.

## Hosting

Code is served by jsDelivr straight from this repo's release tags, so the repo must stay public.
GitHub Pages is turned off. Possible future move: Cloudflare Pages on our own subdomain
(works with a private repo, adds branch preview links and control over caching).

## Media

Videos and poster images live in Webflow Assets (`cdn.prod.website-files.com`), not in this repo's hosting.
`pages/pinocchio-for-schools/media/` keeps the source files only.

## Releasing

Webflow loads global files from a pinned tag, so pushing alone changes nothing on the site.

1. Commit and push.
2. Tag a new version: `git tag v1.0.1 && git push --tags`.
3. Update the version in the Webflow site head/footer code and in each page's Before `</body>` code, then publish.
