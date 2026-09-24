# CLT website code

Source of truth for the custom CSS and JS on commonwealthlyrictheater.com (Webflow).
Anything that runs on the site should match a file here.

## Global

| File | Used by |
| --- | --- |
| `global/clt-master.css` | Design system. Site settings → Head code, via jsDelivr (`clt-master.min.css`) |
| `global/clt-core.js` | Curtain, Lenis, reveals, dialogs, lighting. Site settings → Footer code, via jsDelivr |
| `global/clt-mainnav.js` | Inline in the Main Nav component |
| `global/clt-form-tracking.js` | Inline in Site settings → Footer code |
| `global/clt-core.updated.js` | Legacy. Still loaded by the published custom domain; delete after it is republished |

## Pages

| File | Used by |
| --- | --- |
| `pages/<page>/<page>.css` | That page's Code Embeds |
| `pages/<page>/<page>.js` | That page → Before `</body>` (GitHub Pages or inline) |
| `pages/shared/performances.js` | Inline in Site settings → Footer code (Home + Events) |
| `pages/about-us/about-team-cms.js` | Inline in About → Before `</body>` |

## Releasing

Webflow loads global files from a pinned tag, so pushing alone changes nothing on the site.

1. Commit and push.
2. Tag a new version: `git tag v1.0.1 && git push --tags`.
3. Update the version in the Webflow head/footer code and publish.
