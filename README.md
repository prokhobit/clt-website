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
| `pages/shared/performances.js` | Site settings → Footer code, via jsDelivr (Home + Events) |
| `pages/about-us/about-team-cms.js` | Inline in About → Before `</body>` |

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
