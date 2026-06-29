/**
 * WHERE SHE STANDS — Interactions & State
 * Manages global app state, UI events, and scroll-triggered animations.
 */

const appState = {
  activeFilter: 'all',
  activeWeights: [],
  activeSortDimension: 'total'
};

/**
 * Update state and notify listeners
 */
function setState(key, value) {
  appState[key] = value;
  document.dispatchEvent(new CustomEvent('stateChange', { detail: { key, value } }));
}

/**
 * Intersection Observer for scroll-triggered section animations
 */
function initScrollObserver() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section--visible');
      }
    });
  }, { threshold: 0.15 });

  sections.forEach((section) => observer.observe(section));
}

/**
 * Initialize the application
 */
function init() {
  initScrollObserver();
}

document.addEventListener('DOMContentLoaded', init);
