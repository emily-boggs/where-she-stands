# Active Context

_Current focus, decisions, and work in progress._

## Current State
Project is complete and deployed to production at https://where-she-stands.vercel.app

## Recent Decisions
- Story arc: quiz ("Find Where You Stand") placed at the END of the page, after all data sections -- user sees the full picture before personalizing
- No framework -- vanilla HTML/CSS/JS kept the project lightweight and fast
- D3.js used for both charts (pipeline funnel + scatter plot)
- Scorecard cards are flippable (tap to see a quick fact on the back)
- Race/ethnicity filter applies multipliers to base metrics rather than storing separate datasets
- Recommendation engine scores industries based on user priorities + identity filter
- Three personas (Maya, Diane, Carmen) with full multi-paragraph stories in modals
- Deployed on Vercel with auto-deploy on push to main

## Architecture Notes
- Single index.html page with semantic sections
- data.js holds all content/metrics as a global DATA object
- interactions.js handles all rendering and interactivity
- No build step -- open index.html or push to Vercel

## What's Done
Everything. The project shipped with all planned features:
hero, scorecard, funnel, scatter, race filter, personas, quiz, results, footer with sources.
