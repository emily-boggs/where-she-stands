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
   Personalizer (E3)
   ========================================= */

const dimensionIcons = {
  pay: '💰',
  leadership: '📈',
  leave: '👶',
  growth: '🚀'
};

function initPersonalizer() {
  const container = document.querySelector('.personalizer__options');
  if (!container) return;

  DATA.dimensions.forEach((dim) => {
    const btn = createToggleButton({
      label: DATA.dimensionLabels[dim],
      value: dim,
      icon: dimensionIcons[dim],
      isActive: false,
      onClick: handlePersonalizerToggle
    });
    container.appendChild(btn);
  });
}

function handlePersonalizerToggle(value, btn) {
  const weights = appState.activeWeights;
  const idx = weights.indexOf(value);

  if (idx > -1) {
    weights.splice(idx, 1);
    btn.classList.remove('toggle-btn--active');
    btn.setAttribute('aria-pressed', 'false');
  } else {
    weights.push(value);
    btn.classList.add('toggle-btn--active');
    btn.setAttribute('aria-pressed', 'true');
  }

  setState('activeWeights', [...weights]);
  renderScorecard();
}

/* =========================================
   Scorecard Grid (E4)
   ========================================= */

function initScorecard() {
  renderScorecard();
}

function renderScorecard() {
  const container = document.querySelector('.scorecard__grid');
  if (!container) return;

  container.innerHTML = '';

  const sorted = [...DATA.industries].sort((a, b) => {
    if (appState.activeSortDimension === 'total') {
      return computeWeightedScore(b.scores, appState.activeWeights) -
             computeWeightedScore(a.scores, appState.activeWeights);
    }
    return (b.scores[appState.activeSortDimension] || 0) -
           (a.scores[appState.activeSortDimension] || 0);
  });

  sorted.forEach((industry, i) => {
    const card = createScorecardCard(industry, appState.activeWeights);
    if (i === 0) card.classList.add('scorecard__card--top');
    container.appendChild(card);
  });
}

/* =========================================
   Leadership Pipeline Funnel (E5)
   ========================================= */

let funnelActiveIndustry = 'technology';

function initFunnel() {
  const controlsContainer = document.querySelector('.funnel__controls');
  if (!controlsContainer) return;

  DATA.industries.forEach((ind) => {
    const btn = createToggleButton({
      label: ind.name,
      value: ind.id,
      icon: '',
      isActive: ind.id === funnelActiveIndustry,
      onClick: handleFunnelToggle
    });
    controlsContainer.appendChild(btn);
  });

  renderFunnel(funnelActiveIndustry);
}

function handleFunnelToggle(value, btn) {
  funnelActiveIndustry = value;
  const controls = document.querySelectorAll('.funnel__controls .toggle-btn');
  controls.forEach((b) => {
    b.classList.toggle('toggle-btn--active', b.dataset.value === value);
    b.setAttribute('aria-pressed', b.dataset.value === value);
  });
  renderFunnel(value);
}

function renderFunnel(industryId) {
  const chartEl = document.querySelector('.funnel__chart');
  const calloutEl = document.querySelector('.funnel__callout');
  if (!chartEl) return;

  chartEl.innerHTML = '';

  const levels = DATA.pipeline.levels;
  const values = DATA.pipeline.byIndustry[industryId];
  const industry = DATA.industries.find((i) => i.id === industryId);

  const width = 700;
  const height = levels.length * 60 + 40;
  const barMaxWidth = 500;
  const labelWidth = 100;

  const svg = d3.select(chartEl)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', `Pipeline funnel for ${industry.name}`);

  // Find steepest drop
  let maxDrop = 0;
  let maxDropIdx = 0;
  for (let i = 1; i < values.length; i++) {
    const drop = values[i - 1] - values[i];
    if (drop > maxDrop) { maxDrop = drop; maxDropIdx = i; }
  }

  levels.forEach((level, i) => {
    const y = i * 60 + 20;
    const barWidth = (values[i] / 100) * barMaxWidth;
    const isDropoff = i === maxDropIdx;

    // Label
    svg.append('text')
      .attr('x', labelWidth - 10)
      .attr('y', y + 20)
      .attr('text-anchor', 'end')
      .attr('fill', '#8a8a8a')
      .attr('font-size', '13')
      .attr('font-family', 'Barlow Condensed, sans-serif')
      .text(level);

    // Bar
    svg.append('rect')
      .attr('x', labelWidth)
      .attr('y', y + 4)
      .attr('width', 0)
      .attr('height', 28)
      .attr('rx', 3)
      .attr('fill', isDropoff ? '#ff6b6b' : '#c9a227')
      .transition()
      .duration(600)
      .delay(i * 80)
      .attr('width', barWidth);

    // Value
    svg.append('text')
      .attr('x', labelWidth + barWidth + 10)
      .attr('y', y + 23)
      .attr('fill', '#f5f0e8')
      .attr('font-size', '14')
      .attr('font-weight', '600')
      .attr('font-family', 'Barlow Condensed, sans-serif')
      .attr('opacity', 0)
      .text(values[i] + '%')
      .transition()
      .duration(400)
      .delay(i * 80 + 300)
      .attr('opacity', 1);
  });

  // Callout
  if (calloutEl) {
    const dropFrom = levels[maxDropIdx - 1];
    const dropTo = levels[maxDropIdx];
    calloutEl.textContent = `In ${industry.name}, the steepest drop is from ${dropFrom} to ${dropTo} — women go from ${values[maxDropIdx - 1]}% to ${values[maxDropIdx]}%.`;
  }
}

/* =========================================
   Pay vs Growth Scatter Plot (E6)
   ========================================= */

function initScatter() {
  renderScatter();
}

function renderScatter() {
  const chartEl = document.querySelector('.scatter__chart');
  if (!chartEl) return;

  chartEl.innerHTML = '';

  const margin = { top: 30, right: 30, bottom: 50, left: 60 };
  const width = 700;
  const height = 500;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const svg = d3.select(chartEl)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Pay equity versus career growth scatter plot');

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([40, 100]).range([0, innerW]);
  const y = d3.scaleLinear().domain([30, 90]).range([innerH, 0]);

  // Quadrant lines
  g.append('line').attr('x1', x(70)).attr('x2', x(70)).attr('y1', 0).attr('y2', innerH)
    .attr('stroke', '#333').attr('stroke-dasharray', '4');
  g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(60)).attr('y2', y(60))
    .attr('stroke', '#333').attr('stroke-dasharray', '4');

  // Quadrant labels
  const quadrants = [
    { label: 'High Pay, High Growth', x: x(85), y: y(80), anchor: 'middle' },
    { label: 'Low Pay, High Growth', x: x(55), y: y(80), anchor: 'middle' },
    { label: 'High Pay, Low Growth', x: x(85), y: y(40), anchor: 'middle' },
    { label: 'Low Pay, Low Growth', x: x(55), y: y(40), anchor: 'middle' },
  ];
  quadrants.forEach((q) => {
    g.append('text').attr('x', q.x).attr('y', q.y)
      .attr('text-anchor', q.anchor).attr('fill', '#555').attr('font-size', '11')
      .attr('font-family', 'Barlow Condensed, sans-serif')
      .text(q.label);
  });

  // Axes
  g.append('g').attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(6))
    .selectAll('text').attr('fill', '#8a8a8a');
  g.append('g')
    .call(d3.axisLeft(y).ticks(6))
    .selectAll('text').attr('fill', '#8a8a8a');

  // Axis labels
  svg.append('text').attr('x', width / 2).attr('y', height - 6)
    .attr('text-anchor', 'middle').attr('fill', '#8a8a8a').attr('font-size', '13')
    .attr('font-family', 'Barlow Condensed, sans-serif')
    .text('Pay Equity Score');
  svg.append('text').attr('x', 16).attr('y', height / 2)
    .attr('text-anchor', 'middle').attr('fill', '#8a8a8a').attr('font-size', '13')
    .attr('font-family', 'Barlow Condensed, sans-serif')
    .attr('transform', `rotate(-90, 16, ${height / 2})`)
    .text('Career Growth Score');

  // Style axis lines
  g.selectAll('.domain, line').attr('stroke', '#333');

  // Dots + labels
  const tooltip = d3.select(chartEl).append('div').attr('class', 'scatter__tooltip');

  DATA.industries.forEach((ind) => {
    const cx = x(ind.scores.pay);
    const cy = y(ind.scores.growth);

    g.append('circle')
      .attr('cx', cx).attr('cy', cy).attr('r', 0)
      .attr('fill', '#c9a227').attr('stroke', '#f5f0e8').attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event) {
        d3.select(this).transition().duration(150).attr('r', 12);
        tooltip.style('opacity', 1)
          .html(`<strong>${ind.name}</strong><br>Pay: ${ind.scores.pay} | Growth: ${ind.scores.growth}`)
          .style('left', (event.offsetX + 15) + 'px')
          .style('top', (event.offsetY - 10) + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(150).attr('r', 8);
        tooltip.style('opacity', 0);
      })
      .transition().duration(500).delay(200)
      .attr('r', 8);

    g.append('text')
      .attr('x', cx).attr('y', cy - 14)
      .attr('text-anchor', 'middle').attr('fill', '#f5f0e8').attr('font-size', '11')
      .attr('font-family', 'DM Sans, sans-serif')
      .attr('opacity', 0)
      .text(ind.name.split(' ')[0])
      .transition().duration(400).delay(500)
      .attr('opacity', 0.8);
  });
}

/* =========================================
   Race & Ethnicity Filter (E7)
   ========================================= */

function initRaceFilter() {
  const controlsContainer = document.querySelector('.race-filter__controls');
  if (!controlsContainer) return;

  Object.keys(DATA.raceLabels).forEach((key) => {
    const btn = createToggleButton({
      label: DATA.raceLabels[key],
      value: key,
      icon: '',
      isActive: key === 'all',
      onClick: handleRaceFilterToggle
    });
    controlsContainer.appendChild(btn);
  });

  renderRaceFilterGrid();
}

function handleRaceFilterToggle(value, btn) {
  setState('activeFilter', value);
  const controls = document.querySelectorAll('.race-filter__controls .toggle-btn');
  controls.forEach((b) => {
    b.classList.toggle('toggle-btn--active', b.dataset.value === value);
    b.setAttribute('aria-pressed', b.dataset.value === value);
  });
  renderRaceFilterGrid();
}

function renderRaceFilterGrid() {
  const grid = document.querySelector('.race-filter__grid');
  const callout = document.querySelector('.race-filter__callout');
  if (!grid) return;

  grid.innerHTML = '';

  const filter = appState.activeFilter;
  const mod = DATA.raceModifiers[filter];

  DATA.industries.forEach((ind) => {
    const card = document.createElement('article');
    card.className = 'race-card';

    let rows = '';
    DATA.dimensions.forEach((dim) => {
      const base = ind.scores[dim];
      const adjusted = Math.round(base * mod[dim]);
      const diff = adjusted - base;
      const diffStr = diff === 0 ? '—' : (diff > 0 ? `+${diff}` : `${diff}`);
      const diffClass = diff < 0 ? 'race-card__diff--neg' : diff > 0 ? 'race-card__diff--pos' : '';
      rows += `
        <div class="race-card__row">
          <span class="race-card__dim">${DATA.dimensionLabels[dim]}</span>
          <span class="race-card__score">${adjusted}</span>
          <span class="race-card__diff ${diffClass}">${diffStr}</span>
        </div>`;
    });

    card.innerHTML = `<h3 class="race-card__title">${ind.name}</h3>${rows}`;
    grid.appendChild(card);
  });

  if (callout) {
    if (filter === 'all') {
      callout.textContent = '';
    } else {
      const label = DATA.raceLabels[filter];
      const worstDim = DATA.dimensions.reduce((worst, dim) =>
        mod[dim] < mod[worst] ? dim : worst, DATA.dimensions[0]);
      const pctDrop = Math.round((1 - mod[worstDim]) * 100);
      callout.textContent = `For ${label}, the biggest gap is in ${DATA.dimensionLabels[worstDim]} — scores drop by up to ${pctDrop}% compared to the average.`;
    }
  }
}

/* =========================================
   Persona Vignettes (E8)
   ========================================= */

function initVignettes() {
  const container = document.querySelector('.vignettes__grid');
  if (!container) return;

  DATA.personas.forEach((persona) => {
    container.appendChild(createVignetteCard(persona));
  });
}

/* =========================================
   Recommendation Engine (E9)
   ========================================= */

function initRecommendation() {
  renderRecommendation();
  document.addEventListener('stateChange', renderRecommendation);
}

function renderRecommendation() {
  const container = document.querySelector('.recommendation__result');
  if (!container) return;

  const weights = appState.activeWeights;
  const filter = appState.activeFilter;
  const mod = DATA.raceModifiers[filter];

  // Score each industry with weights + race modifier
  const scored = DATA.industries.map((ind) => {
    const adjusted = {};
    DATA.dimensions.forEach((dim) => {
      adjusted[dim] = Math.round(ind.scores[dim] * mod[dim]);
    });
    return { ...ind, adjustedScores: adjusted, total: computeWeightedScore(adjusted, weights) };
  }).sort((a, b) => b.total - a.total);

  const top = scored[0];
  const runner = scored[1];

  container.innerHTML = `
    <div class="recommendation__badge">
      <svg class="recommendation__medallion" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r="72" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="80" cy="80" r="64" fill="none" stroke="currentColor" stroke-width="1"/>
        <polygon points="80,20 86,36 80,30 74,36" fill="currentColor"/>
        <polygon points="80,140 86,124 80,130 74,124" fill="currentColor"/>
        <polygon points="20,80 36,74 30,80 36,86" fill="currentColor"/>
        <polygon points="140,80 124,74 130,80 124,86" fill="currentColor"/>
      </svg>
      <span class="recommendation__badge-label">Best For You</span>
      <span class="recommendation__badge-industry">${top.name}</span>
      <span class="recommendation__badge-score">Score: ${top.total}</span>
    </div>
    <div class="recommendation__runner">
      <span class="recommendation__runner-label">Runner-Up</span>
      <span class="recommendation__runner-industry">${runner.name}</span>
      <span class="recommendation__runner-score">Score: ${runner.total}</span>
    </div>
    <p class="recommendation__cta">
      ${weights.length > 0
        ? `Based on your priorities (${weights.map(w => DATA.dimensionLabels[w]).join(', ')}), <strong>${top.name}</strong> is where you stand the best chance.`
        : 'Select your priorities above to get a personalized recommendation.'}
    </p>
    <button class="recommendation__share" onclick="copyResult()">Copy My Result</button>
  `;
}

function copyResult() {
  const weights = appState.activeWeights;
  const filter = appState.activeFilter;
  const mod = DATA.raceModifiers[filter];
  const scored = DATA.industries.map((ind) => {
    const adjusted = {};
    DATA.dimensions.forEach((dim) => {
      adjusted[dim] = Math.round(ind.scores[dim] * mod[dim]);
    });
    return { ...ind, total: computeWeightedScore(adjusted, weights) };
  }).sort((a, b) => b.total - a.total);

  const text = `Where She Stands: My top industry is ${scored[0].name} (score: ${scored[0].total}). Priorities: ${weights.length ? weights.map(w => DATA.dimensionLabels[w]).join(', ') : 'none set'}.`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.recommendation__share');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy My Result'; }, 2000); }
  });
}

/* =========================================
   Init
   ========================================= */

function init() {
  initScrollObserver();
  initHookCountUp();
  initPersonalizer();
  initScorecard();
  initFunnel();
  initScatter();
  initRaceFilter();
  initVignettes();
  initRecommendation();
}

document.addEventListener('DOMContentLoaded', init);
