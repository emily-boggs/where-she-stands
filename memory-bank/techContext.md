# Tech Context

_The tech stack, tools, and constraints._


# Tech Context -- Where She Stands

## Stack
- **HTML5** -- semantic markup, single page
- **CSS3** -- custom properties, grid, flexbox, animations, glassmorphism
- **Vanilla JavaScript** -- no framework
- **D3.js v7** -- data visualization (pipeline funnel + scatter plot)

## Fonts
- Google Fonts:
  - Playfair Display (serif headlines)
  - Barlow Condensed (data labels, chart text)
  - DM Sans (body text)
- Material Icons Outlined (UI icons)
- Loaded via `<link>` in `<head>`

## Animation
- CSS transitions for UI state changes (hover, active, filter toggle)
- CSS `@keyframes` for entrance animations
- Intersection Observer API for scroll-triggered section reveals
- D3 transitions for chart bar/dot animations
- requestAnimationFrame for hero count-up

## Data Approach
- All data lives in `data.js` as a single global `DATA` object
- No API calls, no external data dependencies
- Charts and UI pull from DATA only
- Race/ethnicity filter uses multipliers on base metrics

## No Build Tool Required
- Static HTML/CSS/JS project
- Vercel deploys it as-is (no build command)
- Open `index.html` locally via VS Code Live Server or browser

## Dependencies
| Library | Version | Purpose | CDN |
|---------|---------|---------|-----|
| D3.js | v7 | Data visualization | Yes (d3js.org) |

## Dev Environment
- VS Code
- Live Server extension for local development
- Git + GitHub for version control
- Vercel for deployment (auto-deploys on push to main)

## Deployment
- **Platform:** Vercel
- **Trigger:** Every push to `main` auto-deploys to production
- **Root Directory:** `/` (index.html at root)
- **Build Command:** None (static site)
- **Output Directory:** None (static site)

## Environments
| Environment | Branch | URL |
|-------------|--------|-----|
| Production | main | https://where-she-stands.vercel.app |
| Preview | any PR | https://where-she-stands-[hash].vercel.app |
| Local | any | http://localhost:5500 (Live Server) |
