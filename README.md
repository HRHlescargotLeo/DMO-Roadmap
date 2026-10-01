# UK Debt Management Office — website improvement prototypes (V2)

Five clickable prototypes for improvements to dmo.gov.uk, prepared by ClerksWell following the phase 1 review (1 October 2026). The DMO design layer (Lato, charcoal, the red heading rule, square corners, GOV.UK yellow focus) lives entirely in `src/css/theme.css`; delete that file to get the greyscale prototypes back. Lato and Roboto Mono are self-hosted in `src/assets/fonts` (SIL Open Font Licence), as the DMO self-hosts Lato. The DMO logo is drawn as a text wordmark with the red rule; the Royal Arms is not reproduced. There is no photography: the DMO site uses almost none, so none was added.

Every page follows GOV.UK Design System patterns (date input, error summary, tables, summary lists, step-by-step, question pages, notification banner) and targets WCAG 2.2 AA.

## View
Live: https://hrhlescargotleo.github.io/DMO-Roadmap/

Or open `docs/index.html` in a browser. No server or install needed.

GitHub Pages publishes from the `docs/` folder on `main`
(Settings → Pages → Deploy from a branch → `main` / `/docs`).

## Prototypes
1. Gilt market data — `pages/gilts-in-issue.html`, plus the data catalogue at `pages/data-catalogue.html`
2. Gilt operations — `pages/gilt-operation.html` (any operation via `?op=<id>`), `pages/operations-calendar.html`, `pages/alerts.html`
3. Remit at a glance — `pages/remit.html`, plus the homepage at `pages/home.html`
4. Buying gilts — `pages/buying-gilts.html`, `pages/check-eligibility.html`, `pages/gilt-value.html` (`?gilt=<id>`)
5. PWLB rates — `pages/pwlb-rates.html`, `pages/pwlb-apply.html`

Module library: `modules/library.html`. Requirements (R-numbers mapped to phase 1 idea numbers): `requirements/requirements.md`.

## Data
Gilt names, operation dates and sizes up to 7 October 2026 and the 2026-27 remit (revised 23 April 2026) come from dmo.gov.uk. Amounts in issue, ISINs (deliberately fake, `GB00SMPL…`), prices, auction results, sales to date and PWLB rates are sample data in `src/js/data.js`, and are labelled "sample" on every page.

## Build
```
node build-includes.js && node validate.js
```
Edit files in `src/`; `docs/` is generated (commit it, as GitHub Pages serves it). The prototype navigator (top bar with the Notes switch) and the previous/next footer live in `src/includes/`. Shared behaviour is in `src/js/wireframe.js`; DMO-specific behaviour in `src/js/dmo.js`.

## Status
V2, designed prototypes for internal review (V1 was greyscale). The DMO's own header and footer are replaced by a prototype navigator. Notes are off by default; switch "Notes on" in the top bar to show what each prototype proposes and why, plus in-page annotations (yellow for behaviour, red for open questions for the DMO).
