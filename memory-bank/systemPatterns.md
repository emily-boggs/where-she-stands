# System Patterns

_Common design and architecture patterns used in the project._

# System Patterns — Where She Stands

## Architecture Pattern
Single-page static application. All state managed in
JavaScript. No routing, no backend, no build step.

## State Management
A single global state object in `interactions.js`:

```js
const appState = {
  activeFilter: 'all',        // race/ethnicity filter
  activeWeights: [],          // personalizer selections
  activeSortDimension: 'total' // scorecard sort
}