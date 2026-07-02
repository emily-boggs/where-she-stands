# System Patterns

_Common design and architecture patterns used in the project._

# System Patterns -- Where She Stands

## Architecture Pattern
Single-page static application. All logic in two JS files
(data.js + interactions.js). No routing, no backend, no build step.

## File Structure
```
index.html        -- Single page, semantic HTML5 sections
styles.css        -- All styles, BEM naming, CSS custom properties
data.js           -- DATA object: industries, metrics, pipeline, personas, etc.
interactions.js   -- All interactivity: renders UI, charts, quiz, modals
```

## Data Layer (data.js)
A single global `DATA` object contains all project data:
- `industries[]` -- 6 industries with metrics for each dimension
- `dimensions[]` -- ['pay', 'leadership', 'leave', 'growth']
- `pipeline` -- levels and % women by industry at each career level
- `raceModifiers` -- multipliers that adjust base metrics by race/ethnicity
- `personas[]` -- 3 story characters with full narratives
- `careerStages[]` -- quiz options for career stage
- `jobLinks` -- LinkedIn/Indeed links per industry

## State Management
Simple module-level variables (no single state object):
```js
let funnelIndustry = 'technology';  // which industry the funnel shows
let activeRace = 'all';             // race/ethnicity filter selection
const findAnswers = { priorities: [], identity: 'all', career: 'mid' };  // quiz state
```

## Rendering Pattern
Everything renders on DOMContentLoaded via `init()`:
1. initScrollObserver() -- IntersectionObserver adds .section--visible
2. initHeroStat() -- count-up animation on hero stat
3. initHeroMarkers() -- position + click handlers for persona markers
4. renderScorecard() -- builds flip cards from DATA.industries
5. initFunnel() -- builds industry toggle buttons, calls renderFunnel()
6. renderScatter() -- D3 scatter plot (pay vs. growth)
7. initRaceFilter() -- builds race buttons, calls renderRaceGrid()
8. initFind() -- builds quiz UI, attaches submit handler

## D3 Chart Pattern
- Select container element, clear innerHTML
- Create SVG with viewBox (responsive)
- Define gradients in <defs>
- Draw grid lines, axes, bars/dots with transitions
- Animate with .transition().duration().delay()

## Scroll Reveal
IntersectionObserver watches all `.section` elements.
When threshold (0.08) is hit, adds `.section--visible` class.
CSS handles the entrance animation via opacity/transform.

## Modal Pattern
- Hidden `<div>` in DOM with `hidden` attribute
- openStoryModal(persona) fills content + removes hidden
- Close via X button, backdrop click, or Escape key
- Body overflow locked while open

## Toggle Button Pattern
All filters (industry, race, career) use `.toggle-btn` elements:
- Click toggles `.toggle-btn--active` class
- Updates the relevant state variable
- Calls the re-render function for that section

## CSS Patterns
- BEM naming: `.block__element--modifier`
- CSS custom properties for colors, fonts, spacing
- Glassmorphic cards: backdrop-filter blur + semi-transparent bg
- `prefers-reduced-motion` media query disables animations
