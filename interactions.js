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

/* =========================================
   Reusable Component Shells (Task 1.5)
   ========================================= */

/**
 * Create a dimension toggle button (used by personalizer & filters)
 */
function createToggleButton({ label, value, icon, isActive, onClick }) {
  const btn = document.createElement('button');
  btn.className = `toggle-btn${isActive ? ' toggle-btn--active' : ''}`;
  btn.setAttribute('aria-pressed', isActive);
  btn.dataset.value = value;
  btn.innerHTML = `<span class="toggle-btn__icon">${icon}</span><span class="toggle-btn__label">${label}</span>`;
  btn.addEventListener('click', () => onClick(value, btn));
  return btn;
}

/**
 * Create an industry scorecard card
 */
function createScorecardCard(industry, weights) {
  const card = document.createElement('article');
  card.className = 'scorecard__card';
  card.dataset.industry = industry.id;

  const totalScore = computeWeightedScore(industry.scores, weights);

  let dimensionBars = '';
  DATA.dimensions.forEach((dim) => {
    const score = industry.scores[dim];
    const colorClass = score >= 70 ? 'bar--good' : score >= 50 ? 'bar--mid' : 'bar--low';
    dimensionBars += `
      <div class="scorecard__bar-row">
        <span class="scorecard__bar-label">${DATA.dimensionLabels[dim]}</span>
        <div class="scorecard__bar-track">
          <div class="scorecard__bar-fill ${colorClass}" style="width:${score}%" aria-valuenow="${score}" role="meter" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <span class="scorecard__bar-value">${score}</span>
      </div>`;
  });

  card.innerHTML = `
    <h3 class="scorecard__card-title">${industry.name}</h3>
    <span class="scorecard__card-score">${totalScore}</span>
    <div class="scorecard__bars">${dimensionBars}</div>`;
  return card;
}

/**
 * Create a persona vignette card
 */
function createVignetteCard(persona) {
  const card = document.createElement('article');
  card.className = 'vignette__card';
  const priorityTags = persona.priorities
    .map((p) => `<span class="vignette__tag">${DATA.dimensionLabels[p]}</span>`)
    .join('');
  card.innerHTML = `
    <h3 class="vignette__name">${persona.name}, ${persona.age}</h3>
    <p class="vignette__situation">${persona.situation}</p>
    <blockquote class="vignette__quote">"${persona.quote}"</blockquote>
    <div class="vignette__priorities">${priorityTags}</div>`;
  return card;
}

/**
 * Compute a weighted overall score for an industry
 */
function computeWeightedScore(scores, weights) {
  if (!weights || weights.length === 0) {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  const weighted = weights.reduce((sum, dim) => sum + (scores[dim] || 0), 0);
  const unweighted = DATA.dimensions
    .filter((d) => !weights.includes(d))
    .reduce((sum, d) => sum + (scores[d] || 0), 0);
  const total = weighted * 1.5 + unweighted;
  const divisor = weights.length * 1.5 + (DATA.dimensions.length - weights.length);
  return Math.round(total / divisor);
}

/* =========================================
   Count-Up Animation (Task 2.2)
   ========================================= */

/**
 * Animate a number from 0 to target inside an element
 */
function countUp(el, target, duration) {
  const start = performance.now();
  const suffix = el.dataset.suffix || '';

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/**
 * Observe the hero hook stat and trigger count-up when visible
 */
function initHookCountUp() {
  const statEl = document.querySelector('.hero__hook-stat');
  if (!statEl) return;
  const target = parseInt(statEl.dataset.value, 10);
  statEl.textContent = '0%';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(statEl, target, 1500);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(statEl);
}

/* =========================================
   Scroll Observer
   ========================================= */

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

/* =========================================
   Init
   ========================================= */

function init() {
  initScrollObserver();
  initHookCountUp();
}

document.addEventListener('DOMContentLoaded', init);
