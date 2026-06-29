# Tech Context

_The tech stack, tools, and constraints._


# Tech Context — Where She Stands

## Stack
- **HTML5** — semantic markup, single page
- **CSS3** — custom properties, grid, flexbox, animations
- **Vanilla JavaScript** — no framework required
- **SVG** — Art Deco decorative elements and dividers

## Charting
- **D3.js** (recommended) for:
  - Scatter plot (Pay vs. Growth)
  - Pipeline funnel chart
  - Animated bar transitions
- Alternative: **Chart.js** for simpler charts if D3
  feels like overkill for scope

## Fonts
- Google Fonts:
  - Playfair Display
  - Barlow Condensed
  - DM Sans
- Load via `<link>` in `<head>`

## Animation
- CSS transitions for UI state changes
  (hover, active, filter toggle)
- CSS `@keyframes` for entrance animations
- Intersection Observer API for scroll-triggered animations
- SVG `stroke-dashoffset` animation for divider draw-in effect
- D3 transitions for chart data updates

## Data Approach
- All data lives in `data.js` as structured JS objects
- No API calls, no external data dependencies
- Charts and UI pull from data.js only
- Single source of truth for all values

## No Build Tool Required
- This is a static HTML/CSS/JS project
- Vercel will deploy it as a static site automatically
- No webpack, Vite, or bundler needed
- Open `index.html` locally via VS Code Live Server

## Dependencies
| Library | Version | Purpose            | CDN Available |
|---------|---------|--------------------|---------------|
| D3.js   | v7      | Data visualization | ✅ Yes        |

## Dev Environment
- VS Code
- Live Server extension for local development
- Git + GitHub for version control
- Vercel for deployment (auto-deploys on push to main)

## Deployment
- **Platform:** Vercel
- **Trigger:** Every push to `main` branch
  auto-deploys to production
- **Preview Deploys:** Every push to a non-main branch
  generates a unique preview URL — great for testing
  before merging
- **Root Directory:** `/` (index.html at root)
- **Build Command:** None (static site)
- **Output Directory:** None (static site)

## Environment
| Environment | Branch  | URL                                    |
|-------------|---------|----------------------------------------|
| Production  | main    | https://where-she-stands.vercel.app    |
| Preview     | any PR  | https://where-she-stands-[hash].vercel.app |
| Local       | any     | http://localhost:5500 (Live Server)    |