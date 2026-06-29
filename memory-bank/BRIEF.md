# Project Brief

# Project Brief — Where She Stands

*Last updated: 2026-06-29*
*Version: 1.0.0*

---

## Elevator Pitch

Women are told to "negotiate better" and "lean in" —
but no one hands them a map. **Where She Stands** is
an interactive data story that gives women the map.

It compares 6 industries across 4 dimensions of gender
equity — pay, leadership, family leave, and career growth
— layered by race and ethnicity, and driven by what the
user actually cares about most.

The story doesn't celebrate progress. It exposes gaps.
It names who is being left behind. And it ends with a
clear, personalized answer: *here is where you stand
the best chance.*

---

## The Problem We're Solving

Gender equity data exists — but it's scattered, averaged,
and sanitized. The "women earn 84 cents on the dollar"
headline flattens a story that is actually about:

- **Which industry** you're in
- **What level** you're at
- **What race** you are
- **What you're optimizing for** — pay, growth, or survival

No single resource puts all of that together in a way
that is visual, personal, and honest. This project does.

---

## Who This Is For

### Primary Audience
**Women evaluating where to work** — early-career women
choosing an industry, mid-career women considering a pivot,
women of color who know the "average" doesn't represent them.

### Secondary Audience
**Allies and managers** who want to understand the real
landscape of gender equity — not the PR version.

### Persona Snapshots
| Name   | Age | Situation                              | Cares Most About              |
|--------|-----|----------------------------------------|-------------------------------|
| Maya   | 27  | Tech → Healthcare pivot decision       | Career Growth + Pay Equity    |
| Diane  | 34  | Finance → Public Sector after baby     | Family Leave + Leadership     |
| Carmen | 22  | First job: Manufacturing vs. Retail    | Representation + Growth Speed |

---

## What We're Building

A **single-page interactive data story** built in
HTML, CSS, and vanilla JavaScript. Deployed on Vercel
via GitHub. No framework, no backend, no database.

### The Story Arc
HOOK
"Women make up nearly half the workforce.
So why do they hold less than 15% of C-suite
roles in most industries?"
↓
PERSONALIZE
User selects what matters most to them —
pay, leadership, leave, or growth.
↓
THE BIG PICTURE
Industry scorecard grid — all 6 industries,
all 4 dimensions, color-coded and sortable.
↓
DIG DEEPER
Leadership pipeline funnel — where do women
actually drop off? Pay vs. growth scatter plot —
does high pay mean high advancement? No.
↓
THE REAL STORY
Race & ethnicity filter reveals that every gap
is wider for Black and Hispanic women.
The "average" has been hiding this.
↓
MAKE IT HUMAN
Three persona vignettes connect the data
to lived experience.
↓
YOUR ANSWER
Personalized industry recommendation +
Art Deco "Best For" badges + call to action.


---

## The 6 Industries

| Industry              | Why It's Included                                  |
|-----------------------|----------------------------------------------------|
| Technology            | High pay, but leadership gap is stark              |
| Financial Services    | High pay, low equity — the tension is the story    |
| Healthcare            | Women-majority workforce, but do they lead?        |
| Retail & Consumer     | Large employer of women, often overlooked          |
| Public Sector         | The quiet overperformer on equity metrics          |
| Manufacturing         | The cautionary tale — lowest scores across board   |

---

## The 4 Dimensions

| Dimension               | What It Measures                                        | Scale  |
|-------------------------|---------------------------------------------------------|--------|
| 💰 Pay Equity           | Women's median pay as % of men's in same role/industry  | 0–100% |
| 📈 Leadership Rep       | % of Director+ roles held by women                     | 0–100% |
| 👶 Family Leave Culture | Policy quality + actual use + manager support composite | 0–10   |
| 🚀 Career Growth        | Promotion speed + mentorship + 5yr retention composite  | 0–10   |

---

## The Race & Ethnicity Layer

A core design decision — not an add-on feature.

The overall "women" numbers mask compounding inequity.
This project surfaces breakdowns for:
- White Women
- Black Women
- Hispanic Women
- Asian Women

When a user activates a filter, the data updates across
all charts and a stark callout appears:
*"Black women in Manufacturing earn just 68 cents for
every dollar a man earns. The average hides this."*

---

## Key Design Decisions & Why

| Decision                          | Why We Made It                                      |
|-----------------------------------|-----------------------------------------------------|
| Dark background (#0D0D0D)         | Signals gravity — this data is serious              |
| Purple/lavender accent, no pink   | Authority + femininity without stereotype           |
| Art Deco visual language          | 1920s resonance — women were fighting then too      |
| Invented/simplified data          | Story clarity over data engineering                 |
| Personalizer drives the narrative | Makes the data feel relevant to the individual user |
| Race/ethnicity as a core feature  | Intersectionality is not optional                   |
| Expose inequity, don't soften it  | The story has a point of view                       |
| Static site, no framework         | Fast, deployable, no build complexity               |

---

## What Success Looks Like

A user lands on the page and within 60 seconds:
- Understands that the industry they thought was best
  for women might not be
- Has filtered the data to reflect their own identity
- Has a personalized recommendation they trust
- Walks away with a question to ask their next employer

**The data story has done its job when someone says:**
> *"I didn't know that. That changes how I think
> about this."*

---

## What This Is NOT

- ❌ A celebration of how far women have come
- ❌ A corporate DEI report
- ❌ A dashboard with filters for the sake of filters
- ❌ A project that uses real-time or live data
- ❌ Optimized for mobile (tablet 768px is minimum)
- ❌ A backend application

---

## Scope & Constraints

| Item                  | In Scope                        | Out of Scope              |
|-----------------------|---------------------------------|---------------------------|
| Industries            | 6 defined industries            | Adding more post-launch   |
| Dimensions            | 4 equity dimensions             | Salary range data         |
| Breakdowns            | 4 race/ethnicity groups         | Age, disability, LGBTQ+   |
| Interactivity         | Filter, sort, toggle, hover     | User accounts, saving     |
| Sharing               | Copy-to-clipboard result        | Social API integrations   |
| Responsiveness        | Desktop + tablet (768px+)       | Mobile (<768px)           |
| Data                  | Invented, story-driven          | Live / API data           |
| Deployment            | Vercel via GitHub               | Custom domain (optional)  |

---

## Technical Plan

| Layer           | Technology              | Decision Rationale                  |
|-----------------|-------------------------|-------------------------------------|
| Markup          | HTML5 (semantic)        | Accessible, no overhead             |
| Styles          | CSS3 + custom properties| Design token system, no framework   |
| Logic           | Vanilla JS (ES6+)       | No build tool needed                |
| Data Viz        | D3.js v7 (CDN)          | Best-in-class for custom charts     |
| Decorative      | SVG                     | Art Deco elements, scalable         |
| Version Control | Git + GitHub            | Feature branch workflow             |
| Deployment      | Vercel                  | Auto-deploy on push to main         |

---

## Milestones

| Milestone                        | Status         |
|----------------------------------|----------------|
| Concept & story defined          | ✅ Complete    |
| Data structure documented        | ✅ Complete    |
| Visual direction locked          | ✅ Complete    |
| Memory bank established          | ✅ Complete    |
| GitHub repo created              | 🔴 Not Started |
| Vercel connected                 | 🔴 Not Started |
| Sprint 1 complete (Foundation,   | 🔴 Not Started |
| Hero, Personalizer, Scorecard)   |                |
| Sprint 2 complete (Funnel,       | 🔴 Not Started |
| Scatter, Race/Ethnicity Layer)   |                |
| Sprint 3 complete (Vignettes,    | 🔴 Not Started |
| Badges, Polish, A11y)            |                |
| Deployed to production           | 🔴 Not Started |

---

## Open Questions

- [ ] Race/ethnicity filter: default on or opt-in toggle?
- [ ] Personalizer: dynamic score weighting or preset modes?
- [ ] "Share your result" feature: clipboard copy or
      native share sheet?
- [ ] Art Deco female figure: illustrated from scratch
      or sourced and adapted?
- [ ] Section dividers: SVG animate in on scroll?
- [ ] Custom domain on Vercel post-launch?

---

## Inspiration & References

| Source                              | What It Informs                    |
|-------------------------------------|------------------------------------|
| McKinsey Women in the Workplace     | Data direction + framing           |
| Pew Research Center wage gap data   | Pay equity structure               |
| U.S. Bureau of Labor Statistics     | Industry + leadership benchmarks   |
| Lemoine Mineral Water branding      | Badge compositions, female figure  |
| City Hall Steak & Cocktails poster  | Dark UI, female figure as anchor   |
| Purple Rain cocktail illustration   | Color palette validation           |
| Eclipse of the Unknown linework     | Intricate divider + border language|

---

*Last updated: 2026-06-29*
*Version: 1.0.0*