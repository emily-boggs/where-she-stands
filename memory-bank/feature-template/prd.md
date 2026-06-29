# PRD

_Describe the problem, goals, and success criteria._


# Product Requirements Document — Where She Stands

## Overview
A single-page interactive data story comparing gender
equity across 6 industries, with a race/ethnicity filter
layer and a personalized industry recommendation engine.

---

## Functional Requirements

### FR1 — Hero & Hook
- Display full-viewport hero with title "WHERE SHE STANDS"
- Show opening hook stat on load
- Include Art Deco female figure illustration
- Include scroll indicator

### FR2 — Personalizer
- Present 4 dimension cards for user selection:
  Pay Equity, Leadership, Family Leave, Career Growth
- Allow multi-select and ranking/weighting
- Dynamically reorder scorecard based on selection
- Persist selection state throughout the story

### FR3 — Industry Scorecard Grid
- Display all 6 industries as cards
- Show score for each of 4 dimensions per card
- Color code: green (7+), yellow (5–6.9), red (<5)
- Sortable by any dimension or overall score
- Top-ranked card visually highlighted

### FR4 — Leadership Pipeline Funnel
- Show women's representation at 5 career levels
- Toggle between all 6 industries
- Animate bar transitions on industry change
- Auto-highlight steepest drop-off level
- Dynamic narrative callout per industry

### FR5 — Pay vs. Growth Scatter Plot
- Plot all 6 industries on pay equity vs. career growth axes
- Label quadrants with descriptive names
- Hover tooltip per industry dot
- Narrative intro copy above chart

### FR6 — Race & Ethnicity Filter
- Filter toggle: All Women, White, Black, Hispanic, Asian
- Updates pay equity and leadership data across all charts
- Active filter callout label
- Dynamic inequity callout when WOC filter active

### FR7 — Persona Vignettes
- Display 3 persona cards: Maya, Diane, Carmen
- Each card: name, age, role, priorities, data insight
- Surface matching persona based on personalizer state

### FR8 — Best For Badges & Recommendation
- Display 6 Art Deco medallion badges
- Personalized top industry recommendation
- Runner-up industry displayed
- Closing call to action copy
- Share / copy result button

---

## Non-Functional Requirements

### NFR1 — Performance
- Page load under 3 seconds on standard connection
- Animations run at 60fps

### NFR2 — Responsiveness
- Fully functional at 1440px, 1024px, 768px
- No horizontal scroll at any breakpoint

### NFR3 — Accessibility
- Lighthouse accessibility score 90+
- All charts have text alternatives
- Keyboard navigable end to end
- Color not the only means of conveying information

### NFR4 — Browser Support
- Chrome, Firefox, Safari (latest 2 versions)

---

## Out of Scope
- Mobile (< 768px) optimization
- Real / live data integration
- User accounts or data persistence
- Backend or database