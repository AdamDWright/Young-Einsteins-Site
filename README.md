# Young Einsteins Website

Website for Young Einsteins tutoring, built with Vite, Tailwind CSS, and a
from-scratch EN/VI language toggle. Deployed as a static build to GitHub
Pages.

## Stack

- **Vite** - dev server, build, and HTML partials (`posthtml-include`) for the
  shared header/footer
- **Tailwind CSS v4** - all styling, via `@tailwindcss/vite`
- **Vanilla JS** - mobile nav, scroll-reveal animation, EN/VI language toggle,
  Web3Forms submission
- **Web3Forms** - contact form delivery to the business Outlook inbox, no
  backend required
- **Google Analytics 4** - visitor analytics
- Hosting: **GitHub Pages**, built and deployed via GitHub Actions

## Pages

`index.html`, `about.html`, `programs.html`, `approach.html`, `schedule.html`,
`payments.html`, `contact.html`, `privacy.html`.

## Local development

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # production build to ./dist
npm run preview   # preview the production build locally
```

## Before launch - fill in these placeholders

1. **Web3Forms access key** - in [contact.html](contact.html), set
   `data-web3forms-access-key="..."` on the `<form>`. Get a key at
   [web3forms.com](https://web3forms.com); the destination email address
   (the Outlook inbox) is configured there, not in code.
2. **Google Analytics Measurement ID** - in
   [partials/analytics.html](partials/analytics.html), replace both instances
   of `G-XXXXXXXXXX` with the real GA4 Measurement ID.
3. **Vietnamese translations** - [src/i18n.js](src/i18n.js) contains a
   best-effort AI translation for every string. Have a native or fluent
   Vietnamese speaker proof it before launch.
4. **Vite `base` path** - in [vite.config.js](vite.config.js), `base` is set
   to `/`, which assumes the site is served from a domain root (a custom
   domain, or a GitHub `username.github.io` user/org page). If it instead
   deploys to `username.github.io/repo-name`, change `base` to
   `/repo-name/`.

## How the shared header/footer work

`partials/header.html` and `partials/footer.html` are included into every
page at build time via `<include src="/partials/header.html"></include>`
(`vite-plugin-posthtml` + `posthtml-include`). Edit the partial once and it
updates on every page. Each page sets `<body data-page="...">` so
`src/main.js` can highlight the matching nav link at runtime, since the
partial itself is identical on every page.

## Language toggle

`src/i18n.js` holds every translatable string as `{ key: { en, vi } }`.
Elements needing translation carry `data-i18n="key"`. On load and on toggle,
`applyLanguage()` walks those elements, swaps text, updates `<html lang>`,
and persists the choice to `localStorage` so it survives navigating between
pages. The Privacy Policy page's own content is intentionally left
untranslated (English only) - only the footer link that points to it is
translated.

## Contact form

Submissions post to `https://api.web3forms.com/submit` via `fetch`. If the
access key is missing or the request fails, the form shows the same fallback
message asking users to call or email directly - it never fails silently.

## GitHub Pages deployment

`.github/workflows/deploy.yml` builds the site with `npm ci && npm run build`
and publishes `./dist` via `actions/deploy-pages` on every push to `main`. In
the repository, set **Settings -> Pages -> Source** to **GitHub Actions**
(not "Deploy from branch").

## Free-tier limits

- Web3Forms Free: 250 submissions/month (expected usage: ~15/month)
- GitHub Pages: 100 GB/month bandwidth, 10 builds/hour, 1 GB published size
