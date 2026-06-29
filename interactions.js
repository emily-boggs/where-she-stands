/**
 * WHERE SHE STANDS — Interactions
 * Story-first: everything renders on load.
 * Quiz at the end. Expandable persona stories.
 */

/* =========================================
   Scroll Observer
   ========================================= */

function initScrollObserver() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('section--visible');
    });
  }, { threshold: 0.08 });
  sections.forEach((s) => observer.observe(s));
}

/* =========================================
   Border Frame — fade out on scroll
   ========================================= */

function initBorderFrameFade() {
  const frames = document.querySelectorAll('.border-frame');
  if (!frames.length) return;
  window.addEventListener('scroll', () => {
    frames.forEach((frame) => {
      if (window.scrollY > 80) {
        frame.classList.add('border-frame--hidden');
      } else {
        frame.classList.remove('border-frame--hidden');
      }
    });
  }, { passive: true });
}

/* =========================================
   Hero Count-Up
   ========================================= */

function initHeroStat() {
  const el = document.querySelector('.hero__stat');
  if (!el) return;
  const target = parseInt(el.dataset.value, 10);
  const suffix = el.dataset.suffix || '';
  el.textContent = '0' + suffix;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCount(el, target, suffix, 1200);
      observer.unobserve(el);
    }
  }, { threshold: 0.5 });
  observer.observe(el);
}

function animateCount(el, target, suffix, duration) {
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(p * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* =========================================
   Scorecard
   ========================================= */

function renderScorecard() {
  const grid = document.getElementById('scorecard-grid');
  if (!grid) return;

  DATA.industries.forEach((ind) => {
    const card = document.createElement('article');
    card.className = 'scorecard__card';

    let rows = '';
    DATA.dimensions.forEach((dim) => {
      const val = ind.metrics[dim];
      const formatted = DATA.formatMetric(dim, val);
      rows += `
        <div class="scorecard__metric">
          <span class="scorecard__metric-label">${DATA.dimensionDescriptions[dim]}</span>
          <span class="scorecard__metric-value">${formatted}</span>
        </div>`;
    });

    card.innerHTML = `<h3 class="scorecard__card-name">${ind.name}</h3>${rows}`;
    grid.appendChild(card);
  });
}

/* =========================================
   Pipeline Funnel (D3)
   ========================================= */

let funnelIndustry = 'technology';

function initFunnel() {
  const controls = document.getElementById('funnel-controls');
  if (!controls) return;

  DATA.industries.forEach((ind) => {
    const btn = document.createElement('button');
    btn.className = 'toggle-btn' + (ind.id === funnelIndustry ? ' toggle-btn--active' : '');
    btn.textContent = ind.name;
    btn.dataset.value = ind.id;
    btn.addEventListener('click', () => {
      funnelIndustry = ind.id;
      controls.querySelectorAll('.toggle-btn').forEach((b) => {
        b.classList.toggle('toggle-btn--active', b.dataset.value === ind.id);
      });
      renderFunnel();
    });
    controls.appendChild(btn);
  });

  renderFunnel();
}

function renderFunnel() {
  const el = document.getElementById('funnel-chart');
  const callout = document.getElementById('funnel-callout');
  if (!el) return;
  el.innerHTML = '';

  const levels = DATA.pipeline.levels;
  const values = DATA.pipeline.byIndustry[funnelIndustry];
  const ind = DATA.industries.find((i) => i.id === funnelIndustry);

  const width = 650, height = levels.length * 56 + 20, barMax = 450, labelW = 120;

  const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${width} ${height}`);

  let maxDrop = 0, dropIdx = 0;
  for (let i = 1; i < values.length; i++) {
    const d = values[i - 1] - values[i];
    if (d > maxDrop) { maxDrop = d; dropIdx = i; }
  }

  levels.forEach((lvl, i) => {
    const y = i * 56 + 10;
    const bw = (values[i] / 100) * barMax;
    const isDropoff = i === dropIdx;

    svg.append('text').attr('x', labelW - 8).attr('y', y + 18)
      .attr('text-anchor', 'end').attr('fill', '#9E9E9E').attr('font-size', '12')
      .attr('font-family', 'Barlow Condensed, sans-serif').text(lvl);

    svg.append('rect').attr('x', labelW).attr('y', y + 2).attr('width', 0).attr('height', 24)
      .attr('rx', 3).attr('fill', isDropoff ? '#C47A8A' : '#7B5EA7')
      .transition().duration(500).delay(i * 70).attr('width', bw);

    svg.append('text').attr('x', labelW + bw + 8).attr('y', y + 19)
      .attr('fill', '#F0EDE8').attr('font-size', '13').attr('font-weight', '600')
      .attr('font-family', 'Barlow Condensed, sans-serif')
      .attr('opacity', 0).text(values[i] + '%')
      .transition().duration(300).delay(i * 70 + 300).attr('opacity', 1);
  });

  if (callout) {
    callout.textContent = `In ${ind.name}, the steepest drop is from ${levels[dropIdx - 1]} to ${levels[dropIdx]} — ${values[dropIdx - 1]}% down to ${values[dropIdx]}%.`;
  }
}

/* =========================================
   Scatter Plot (D3)
   ========================================= */

function renderScatter() {
  const el = document.getElementById('scatter-chart');
  if (!el) return;
  el.innerHTML = '';

  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 650, height = 450;
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${width} ${height}`);
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([65, 98]).range([0, w]);
  const y = d3.scaleLinear().domain([4, 10]).range([0, h]); // inverted: lower years = top

  // Axes
  g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(5).tickFormat(d => `$0.${d}`))
    .selectAll('text').attr('fill', '#9E9E9E');
  g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d + ' yrs'))
    .selectAll('text').attr('fill', '#9E9E9E');
  g.selectAll('.domain, line').attr('stroke', '#333');

  // Axis labels
  svg.append('text').attr('x', width / 2).attr('y', height - 4)
    .attr('text-anchor', 'middle').attr('fill', '#9E9E9E').attr('font-size', '12')
    .attr('font-family', 'Barlow Condensed').text('Pay Equity (cents per $1)');
  svg.append('text').attr('x', 14).attr('y', height / 2)
    .attr('text-anchor', 'middle').attr('fill', '#9E9E9E').attr('font-size', '12')
    .attr('font-family', 'Barlow Condensed')
    .attr('transform', `rotate(-90,14,${height / 2})`).text('Years to First Promotion (fewer = better)');

  const tooltip = d3.select(el).append('div').attr('class', 'scatter__tooltip');

  DATA.industries.forEach((ind) => {
    const cx = x(ind.metrics.pay);
    const cy = y(ind.metrics.growth);

    g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 0)
      .attr('fill', '#C9B8E8').attr('stroke', '#F0EDE8').attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event) {
        d3.select(this).transition().duration(100).attr('r', 11);
        tooltip.style('opacity', 1)
          .html(`<strong>${ind.name}</strong><br>Pay: $0.${ind.metrics.pay} | Growth: ${ind.metrics.growth} yrs`)
          .style('left', (event.offsetX + 12) + 'px').style('top', (event.offsetY - 10) + 'px');
      })
      .on('mouseleave', function() {
        d3.select(this).transition().duration(100).attr('r', 7);
        tooltip.style('opacity', 0);
      })
      .transition().duration(400).delay(150).attr('r', 7);

    g.append('text').attr('x', cx).attr('y', cy - 12)
      .attr('text-anchor', 'middle').attr('fill', '#F0EDE8').attr('font-size', '10')
      .attr('font-family', 'DM Sans').attr('opacity', 0)
      .text(ind.name.length > 12 ? ind.name.split(' ')[0] : ind.name)
      .transition().duration(300).delay(400).attr('opacity', 0.7);
  });
}

/* =========================================
   Race / Ethnicity Filter
   ========================================= */

let activeRace = 'all';

function initRaceFilter() {
  const controls = document.getElementById('race-controls');
  if (!controls) return;

  Object.keys(DATA.raceLabels).forEach((key) => {
    const btn = document.createElement('button');
    btn.className = 'toggle-btn' + (key === 'all' ? ' toggle-btn--active' : '');
    btn.textContent = DATA.raceLabels[key];
    btn.dataset.value = key;
    btn.addEventListener('click', () => {
      activeRace = key;
      controls.querySelectorAll('.toggle-btn').forEach((b) => {
        b.classList.toggle('toggle-btn--active', b.dataset.value === key);
      });
      renderRaceGrid();
    });
    controls.appendChild(btn);
  });

  renderRaceGrid();
}

function renderRaceGrid() {
  const grid = document.getElementById('race-grid');
  const callout = document.getElementById('race-callout');
  if (!grid) return;
  grid.innerHTML = '';

  const mod = DATA.raceModifiers[activeRace];

  DATA.industries.forEach((ind) => {
    const card = document.createElement('article');
    card.className = 'race-card';

    let rows = '';
    DATA.dimensions.forEach((dim) => {
      const base = ind.metrics[dim];
      let adjusted;
      if (dim === 'growth') {
        adjusted = Math.round(base * mod[dim] * 10) / 10;
      } else {
        adjusted = Math.round(base * mod[dim]);
      }
      const formatted = DATA.formatMetric(dim, adjusted);

      const diff = dim === 'growth'
        ? Math.round((adjusted - base) * 10) / 10
        : adjusted - base;
      const isWorse = dim === 'growth' ? diff > 0 : diff < 0;
      const isBetter = dim === 'growth' ? diff < 0 : diff > 0;
      const diffStr = diff === 0 ? '' : (diff > 0 ? `+${dim === 'growth' ? diff.toFixed(1) : diff}` : String(dim === 'growth' ? diff.toFixed(1) : diff));
      const cls = isWorse ? 'race-card__diff--neg' : isBetter ? 'race-card__diff--pos' : '';

      rows += `
        <div class="race-card__row">
          <span class="race-card__dim">${DATA.dimensionLabels[dim]}</span>
          <span class="race-card__val">${formatted}</span>
          <span class="race-card__diff ${cls}">${diffStr}</span>
        </div>`;
    });

    card.innerHTML = `<h3 class="race-card__title">${ind.name}</h3>${rows}`;
    grid.appendChild(card);
  });

  if (callout) {
    if (activeRace === 'all') {
      callout.textContent = '';
    } else {
      const label = DATA.raceLabels[activeRace];
      const dims = DATA.dimensions.filter(d => d !== 'leave');
      const worst = dims.reduce((w, d) => {
        const gap = d === 'growth' ? mod[d] - 1 : 1 - mod[d];
        return gap > (w.gap || 0) ? { dim: d, gap } : w;
      }, {});
      const pct = Math.round(worst.gap * 100);
      callout.textContent = `For ${label}, the largest gap is in ${DATA.dimensionLabels[worst.dim]} — ${pct}% worse than the average.`;
    }
  }
}

/* =========================================
   Persona Stories (cards + modal)
   ========================================= */

function renderStories() {
  const grid = document.getElementById('stories-grid');
  if (!grid) return;

  DATA.personas.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'story-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Read ${p.name}'s story`);

    card.innerHTML = `
      <div class="story-card__portrait">${p.name.charAt(0)}</div>
      <h3 class="story-card__name">${p.name}, ${p.age}</h3>
      <p class="story-card__role">${p.role} — ${p.location}</p>
      <blockquote class="story-card__quote">"${p.quote}"</blockquote>
      <span class="story-card__cta">Read her story &rarr;</span>
    `;

    card.addEventListener('click', () => openStoryModal(p));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openStoryModal(p); });
    grid.appendChild(card);
  });
}

function openStoryModal(persona) {
  const modal = document.getElementById('story-modal');
  const content = document.getElementById('story-modal-content');
  if (!modal || !content) return;

  const paragraphs = persona.story.map(p => `<p>${p}</p>`).join('');

  content.innerHTML = `
    <button class="story-modal__close" id="story-modal-close" aria-label="Close story">&times;</button>
    <div class="story-modal__header">
      <div class="story-modal__portrait">${persona.name.charAt(0)}</div>
      <div>
        <h2 class="story-modal__name">${persona.name}</h2>
        <p class="story-modal__meta">${persona.age} — ${persona.role} — ${persona.location}</p>
      </div>
    </div>
    <div class="story-modal__body">${paragraphs}</div>
    <div class="story-modal__insight">${persona.dataInsight}</div>
  `;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('story-modal-close');
  const backdrop = modal.querySelector('.story-modal__backdrop');
  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });
}

/* =========================================
   Find Where You Stand (Quiz at end)
   ========================================= */

const findAnswers = { priorities: [], identity: 'all', career: 'mid' };

function initFind() {
  const priContainer = document.getElementById('find-priorities');
  const idContainer = document.getElementById('find-identity');
  const careerContainer = document.getElementById('find-career');
  const submitBtn = document.getElementById('find-submit');
  if (!priContainer || !submitBtn) return;

  // Priorities
  DATA.dimensions.forEach((dim) => {
    const icons = { pay: '💰', leadership: '📈', leave: '👶', growth: '🚀' };
    const btn = document.createElement('button');
    btn.className = 'toggle-btn';
    btn.innerHTML = `${icons[dim]} ${DATA.dimensionLabels[dim]}`;
    btn.dataset.value = dim;
    btn.addEventListener('click', () => {
      const idx = findAnswers.priorities.indexOf(dim);
      if (idx > -1) { findAnswers.priorities.splice(idx, 1); btn.classList.remove('toggle-btn--active'); }
      else { findAnswers.priorities.push(dim); btn.classList.add('toggle-btn--active'); }
    });
    priContainer.appendChild(btn);
  });

  // Identity
  Object.keys(DATA.raceLabels).forEach((key) => {
    const btn = document.createElement('button');
    btn.className = 'toggle-btn' + (key === 'all' ? ' toggle-btn--active' : '');
    btn.textContent = DATA.raceLabels[key];
    btn.dataset.value = key;
    btn.addEventListener('click', () => {
      findAnswers.identity = key;
      idContainer.querySelectorAll('.toggle-btn').forEach(b => {
        b.classList.toggle('toggle-btn--active', b.dataset.value === key);
      });
    });
    idContainer.appendChild(btn);
  });

  // Career
  DATA.careerStages.forEach((s) => {
    const btn = document.createElement('button');
    btn.className = 'toggle-btn' + (s.id === 'mid' ? ' toggle-btn--active' : '');
    btn.textContent = s.label;
    btn.dataset.value = s.id;
    btn.addEventListener('click', () => {
      findAnswers.career = s.id;
      careerContainer.querySelectorAll('.toggle-btn').forEach(b => {
        b.classList.toggle('toggle-btn--active', b.dataset.value === s.id);
      });
    });
    careerContainer.appendChild(btn);
  });

  submitBtn.addEventListener('click', showResults);
}

function showResults() {
  const section = document.getElementById('results');
  const content = document.getElementById('results-content');
  const actions = document.getElementById('results-actions');
  if (!section || !content) return;

  const mod = DATA.raceModifiers[findAnswers.identity];
  const weights = findAnswers.priorities;

  // Score industries
  const scored = DATA.industries.map((ind) => {
    let score = 0;
    const activeDims = weights.length > 0 ? weights : DATA.dimensions;

    activeDims.forEach((dim) => {
      let val = ind.metrics[dim];
      if (dim === 'growth') {
        val = val * mod[dim];
        // Normalize: lower is better, so invert. Scale 4-10 → 100-0
        score += ((10 - val) / 6) * 100;
      } else {
        val = val * mod[dim];
        // Normalize each to rough 0-100 scale
        if (dim === 'pay') score += val; // already 0-100 (cents)
        else if (dim === 'leadership') score += val * (100 / 30); // max ~30%
        else if (dim === 'leave') score += val * (100 / 20); // max ~20 weeks
      }
    });

    return { ...ind, score: Math.round(score / activeDims.length) };
  }).sort((a, b) => b.score - a.score);

  const top = scored[0];
  const runner = scored[1];
  const links = DATA.jobLinks[top.id];

  section.hidden = false;

  content.innerHTML = `
    <div class="results__badge">
      <svg class="results__medallion" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r="72" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="80" cy="80" r="64" fill="none" stroke="currentColor" stroke-width="1"/>
        <polygon points="80,16 86,32 80,26 74,32" fill="currentColor"/>
        <polygon points="80,144 86,128 80,134 74,128" fill="currentColor"/>
        <polygon points="16,80 32,74 26,80 32,86" fill="currentColor"/>
        <polygon points="144,80 128,74 134,80 128,86" fill="currentColor"/>
      </svg>
      <span class="results__top-label">Best For You</span>
      <span class="results__top-industry">${top.name}</span>
    </div>
    <p class="results__runner">Runner-up: <strong>${runner.name}</strong></p>
    <p class="results__explanation">
      ${weights.length > 0
        ? `Based on what you care about (${weights.map(w => DATA.dimensionLabels[w]).join(', ')}), <strong>${top.name}</strong> is where you stand the best chance.`
        : `Across all dimensions, <strong>${top.name}</strong> comes out on top.`}
    </p>
  `;

  actions.innerHTML = `
    <a href="${links.linkedin}" target="_blank" rel="noopener" class="results__link results__link--linkedin">Search on LinkedIn</a>
    <a href="${links.indeed}" target="_blank" rel="noopener" class="results__link results__link--indeed">${top.id === 'public-sector' ? 'Browse USAJobs' : 'Search on Indeed'}</a>
    <button class="results__copy" onclick="copyResult()">Copy My Result</button>
  `;

  section.scrollIntoView({ behavior: 'smooth' });
  section.classList.add('section--visible');
}

function copyResult() {
  const weights = findAnswers.priorities;
  const mod = DATA.raceModifiers[findAnswers.identity];
  const scored = DATA.industries.map((ind) => {
    let score = 0;
    const dims = weights.length > 0 ? weights : DATA.dimensions;
    dims.forEach((dim) => {
      let val = ind.metrics[dim] * mod[dim];
      if (dim === 'growth') score += ((10 - val) / 6) * 100;
      else if (dim === 'pay') score += val;
      else if (dim === 'leadership') score += val * (100 / 30);
      else if (dim === 'leave') score += val * (100 / 20);
    });
    return { name: ind.name, score: Math.round(score / dims.length) };
  }).sort((a, b) => b.score - a.score);

  const text = `Where She Stands: My best-fit industry is ${scored[0].name}. Priorities: ${weights.length ? weights.map(w => DATA.dimensionLabels[w]).join(', ') : 'all'}. Filter: ${DATA.raceLabels[findAnswers.identity]}.`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.results__copy');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy My Result', 2000); }
  });
}

/* =========================================
   Init — everything renders on load
   ========================================= */

function init() {
  initScrollObserver();
  initBorderFrameFade();
  initHeroStat();
  renderScorecard();
  initFunnel();
  renderScatter();
  initRaceFilter();
  renderStories();
  initFind();
}

document.addEventListener('DOMContentLoaded', init);
