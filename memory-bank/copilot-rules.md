## 🚨 Never Upload Secrets

- Do not store API keys or `.env` in repo.
- Use `.env.example` with placeholders.
- If a secret is leaked: rotate credentials, purge history, notify team.


## Project Context
This is a static single-page interactive data story.
No framework, no build tool, no backend.
Stack: HTML5, CSS3, Vanilla JS, D3.js, SVG.
Deployed on Vercel via GitHub. Auto-deploys on push to main.

## Code Style Rules

### HTML
- Use semantic elements: `<section>`, `<article>`,
  `<figure>`, `<nav>`, `<main>`, `<header>`, `<footer>`
- Every section must have an `id` for scroll targeting
- All images must have descriptive `alt` text
- Interactive elements must have `aria-label` where
  the label is not obvious from context

### CSS
- Use CSS custom properties for ALL colors and fonts
  — never hardcode hex values in component styles
- Follow BEM naming: `.block__element--modifier`
- Mobile-first is NOT required (desktop-first is fine
  for this project scope)
- No CSS frameworks (no Tailwind, no Bootstrap)
- Animations must respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important;
        transition: none !important; }
  }