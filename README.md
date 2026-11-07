# Sakina website (`/website`)

Static, dependency-free marketing and legal site for **سكينة | Sakina**, served by GitHub Pages at
**https://sakina.ahmadburghol.com/**.

- Plain HTML + one stylesheet (`assets/css/style.css`) + one tiny script (`assets/js/lang.js`).
- No external CDNs, no cookies, no analytics, no trackers. Fonts are bundled in `assets/fonts/` (SIL OFL).
- Bilingual: Arabic (default, RTL) and English. Every content block exists in both languages
  (`class="l-ar" lang="ar" dir="rtl"` / `class="l-en" lang="en" dir="ltr"`). Without JavaScript both
  languages are shown stacked; with JavaScript the header toggle switches language, flips `<html lang/dir>`
  and remembers the choice in `localStorage`. `?lang=en` in the URL forces English.
- Links between pages, canonical and Open Graph URLs are absolute (`https://sakina.ahmadburghol.com/...`);
  asset paths are relative, so the pages also render when opened locally. Exception: `404.html` uses
  root-relative asset paths (`/assets/...`) because GitHub Pages serves it for missing URLs at any depth.

```
website/
  index.html  privacy.html  terms.html  support.html  404.html
  assets/css/style.css
  assets/js/lang.js
  assets/img/   icon.svg, favicon-32.png, apple-touch-icon.png, icon-512.png, og-image.svg/.png
  assets/fonts/ IBM Plex Sans Arabic (400/500/600/700), Amiri Regular + OFL licences
  .nojekyll  CNAME
```

## Preview locally

```sh
cd website && python3 -m http.server 8000   # then open http://localhost:8000/
```

(Links between pages point at the live domain by design.)

## Regenerating images

`assets/img/icon.svg` is a copy of `assets/images/icon_master.svg` from the app. PNGs are rendered with
`rsvg-convert`:

```sh
cd website/assets/img
rsvg-convert -w 32  -h 32  icon.svg -o favicon-32.png
rsvg-convert -w 180 -h 180 icon.svg -o apple-touch-icon.png
rsvg-convert -w 512 -h 512 icon.svg -o icon-512.png
# og-image.svg uses the bundled fonts; point fontconfig at them if they are not installed:
#   <fontconfig><dir>/absolute/path/to/website/assets/fonts</dir></fontconfig>  -> fonts.conf
FONTCONFIG_FILE=/path/to/fonts.conf rsvg-convert -w 1200 -h 630 og-image.svg -o og-image.png
```

## Before release (TODO)

- Replace the two store badge links (`href="#"`, marked with `<!-- TODO -->` in `index.html`) with the real
  App Store and Google Play URLs, and swap in the official badge artwork from Apple / Google.
- Replace the screenshot placeholders on `index.html` with real screenshots once they exist.

## Deployment (GitHub Pages)

1. **Workflow.** `.github/workflows/pages.yml` uploads the `website/` folder with
   `actions/upload-pages-artifact` and deploys it with `actions/deploy-pages` on every push to `main` that
   touches `website/**` (it can also be run manually via *Run workflow* / `workflow_dispatch`).
2. **Pages source.** GitHub repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Custom domain.** Same page → **Custom domain:** `sakina.ahmadburghol.com` → **Save**.
   With Actions-based deploys the domain is set here; a `CNAME` file is not required, but
   `website/CNAME` (containing `sakina.ahmadburghol.com`) is kept as harmless documentation.
4. **DNS** at the registrar of `ahmadburghol.com` — add the record:

   | Type  | Host / Name | Value                       | TTL  |
   |-------|-------------|-----------------------------|------|
   | CNAME | `sakina`    | `<github-username>.github.io` | auto |

   If DNS is on Cloudflare, set the record to **DNS only (grey cloud)** until GitHub has issued the
   certificate.
5. Wait for the DNS check on the Pages settings page to pass, then tick **Enforce HTTPS**.
6. **Security.** GitHub → your **Account Settings → Pages → Verified domains** → add and verify
   `ahmadburghol.com` (TXT record) to prevent subdomain takeover.
7. **Private repos.** GitHub Pages on a **private** repository requires a paid GitHub plan. Alternative:
   keep the app repository private and push only `website/` + `.github/workflows/pages.yml` to a separate
   **public** repository (e.g. `sakina-website`).
8. **Final URLs** to paste into App Store Connect and Google Play Console:
   - Privacy Policy: `https://sakina.ahmadburghol.com/privacy.html`
   - Support: `https://sakina.ahmadburghol.com/support.html`
   - Marketing: `https://sakina.ahmadburghol.com/`
   - (Terms of Use: `https://sakina.ahmadburghol.com/terms.html`)
