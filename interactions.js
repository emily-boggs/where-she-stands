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
   Hero (+) Markers — open story modals
   ========================================= */

/* Marker positions as fractions of the ORIGINAL image (2912 × 1632) */
const MARKER_IMAGE_POS = {
  maya:   { x: 0.22, y: 0.13 },
  diane:  { x: 0.18, y: 0.78 },
  carmen: { x: 0.82, y: 0.85 }
};

function positionHeroMarkers() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const markers = hero.querySelectorAll('.hero__marker');
  if (!markers.length) return;

  const IMG_W = 2912, IMG_H = 1632;
  const imgAspect = IMG_W / IMG_H;
  const cW = hero.offsetWidth, cH = hero.offsetHeight;
  const cAspect = cW / cH;

  let displayedW, displayedH, offsetX, offsetY;
  if (cAspect > imgAspect) {
    // viewport wider than image — fill width, crop top/bottom
    displayedW = cW;
    displayedH = (IMG_H / IMG_W) * cW;
    offsetX = 0;
    offsetY = (cH - displayedH) / 2;
  } else {
    // viewport taller than image — fill height, crop sides
    displayedH = cH;
    displayedW = (IMG_W / IMG_H) * cH;
    offsetX = (cW - displayedW) / 2;
    offsetY = 0;
  }

  const PAD = 28; // keep markers at least 28px inside the container edge

  markers.forEach((m) => {
    const pos = MARKER_IMAGE_POS[m.dataset.persona];
    if (!pos) return;
    const rawX = pos.x * displayedW + offsetX;
    const rawY = pos.y * displayedH + offsetY;
    m.style.left = Math.max(PAD, Math.min(cW - PAD, rawX)) + 'px';
    m.style.top  = Math.max(PAD, Math.min(cH - PAD, rawY)) + 'px';
  });
}

function initHeroMarkers() {
  const markers = document.querySelectorAll('.hero__marker');
  markers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const persona = DATA.personas.find(p => p.id === btn.dataset.persona);
      if (persona) openStoryModal(persona);
    });
  });

  positionHeroMarkers();
  window.addEventListener('resize', () => requestAnimationFrame(positionHeroMarkers));
}

/* =========================================
   Scorecard
   ========================================= */

function renderScorecard() {
  const grid = document.getElementById('scorecard-grid');
  if (!grid) return;

  const dimIcons = { pay: 'payments', leadership: 'trending_up', leave: 'child_care', growth: 'rocket_launch' };

  const industryIcons = {
    technology: 'computer',
    'financial-services': 'account_balance',
    healthcare: 'local_hospital',
    retail: 'shopping_cart',
    'public-sector': 'public',
    manufacturing: 'precision_manufacturing'
  };

  const industryGradients = {
    technology: 'linear-gradient(135deg, #1e3a5f, #2c5282)',
    'financial-services': 'linear-gradient(135deg, #1a3a2a, #276749)',
    healthcare: 'linear-gradient(135deg, #1a3a4a, #2a6478)',
    retail: 'linear-gradient(135deg, #5a2d1a, #8b4726)',
    'public-sector': 'linear-gradient(135deg, #2d1a4a, #4a2d6f)',
    manufacturing: 'linear-gradient(135deg, #2d3436, #4a5568)'
  };

  const industryFacts = {
    technology: 'Women hold 47% of entry-level tech roles but only 14% of C-suite positions \u2014 a 33-point drop through the pipeline.',
    'financial-services': 'Black women in finance earn $0.62 for every dollar white men earn \u2014 the widest pay gap of any industry studied.',
    healthcare: 'Healthcare leads all industries in women\'s leadership at 26% of C-suite roles \u2014 nearly double the tech industry.',
    retail: 'Retail offers just 6 weeks paid leave \u2014 the second lowest \u2014 despite employing one of the highest shares of women.',
    'public-sector': 'Government pays most fairly at $0.92 per dollar, but promotes the slowest \u2014 8.5 years to first management role.',
    manufacturing: 'Only 8% of manufacturing C-suite roles are held by women \u2014 the lowest of any industry, with 9 years to first promotion.'
  };

  DATA.industries.forEach((ind) => {
    let blocks = '';
    DATA.dimensions.forEach((dim) => {
      const val = ind.metrics[dim];
      const formatted = DATA.formatMetric(dim, val);
      blocks += `
        <div class="scorecard__block">
          <span class="scorecard__block-icon material-icons-outlined">${dimIcons[dim]}</span>
          <span class="scorecard__block-label">${DATA.dimensionLabels[dim]}</span>
          <span class="scorecard__block-desc">${DATA.dimensionDescriptions[dim]}</span>
          <span class="scorecard__block-value">${formatted}</span>
        </div>`;
    });

    const flip = document.createElement('div');
    flip.className = 'scorecard__flip';
    flip.innerHTML = `
      <div class="scorecard__flip-inner">
        <article class="scorecard__card scorecard__card--front">
          <div class="scorecard__header" style="background:${industryGradients[ind.id]}">
            <h3 class="scorecard__card-name">${ind.name}</h3>
          </div>
          <div class="scorecard__blocks">${blocks}</div>
        </article>
        <article class="scorecard__card scorecard__card--back">
          <span class="material-icons-outlined scorecard__back-icon">lightbulb</span>
          <h3 class="scorecard__back-title">Quick Fact</h3>
          <p class="scorecard__back-text">${industryFacts[ind.id]}</p>
          <span class="scorecard__back-cta">Tap to flip back</span>
        </article>
      </div>
    `;
    flip.addEventListener('click', () => flip.classList.toggle('scorecard__flip--active'));
    grid.appendChild(flip);
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

  const width = 650, height = 480;
  const barW = 52, barR = 26;
  const chartTop = 24, chartBottom = height - 56;
  const chartH = chartBottom - chartTop;
  const leftPad = 52;
  const usableW = width - leftPad - 20;
  const barSpacing = usableW / levels.length;

  const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${width} ${height}`);

  /* gradient definitions */
  const defs = svg.append('defs');
  const grad = defs.append('linearGradient')
    .attr('id', 'funnel-grad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
  grad.append('stop').attr('offset', '0%').attr('stop-color', '#C9B8E8');
  grad.append('stop').attr('offset', '100%').attr('stop-color', '#7B5EA7');

  const dropGrad = defs.append('linearGradient')
    .attr('id', 'funnel-drop-grad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
  dropGrad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(255,255,255,0.65)');
  dropGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ffffff');

  /* steepest drop */
  let maxDrop = 0, dropIdx = 0;
  for (let i = 1; i < values.length; i++) {
    const d = values[i - 1] - values[i];
    if (d > maxDrop) { maxDrop = d; dropIdx = i; }
  }

  /* horizontal grid lines */
  [0, 25, 50, 75].forEach(v => {
    const y = chartBottom - (v / 100) * chartH;
    svg.append('line')
      .attr('x1', leftPad - 4).attr('x2', width - 10)
      .attr('y1', y).attr('y2', y)
      .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-width', 1);
    svg.append('text')
      .attr('x', leftPad - 10).attr('y', y + 4)
      .attr('text-anchor', 'end')
      .attr('fill', 'rgba(255,255,255,0.35)').attr('font-size', '14')
      .attr('font-family', 'Barlow Condensed, sans-serif')
      .text(v + '%');
  });

  /* bars */
  levels.forEach((lvl, i) => {
    const cx = leftPad + barSpacing * i + barSpacing / 2;
    const barH = (values[i] / 100) * chartH;
    const isDropoff = i === dropIdx;

    /* gray background track */
    svg.append('rect')
      .attr('x', cx - barW / 2).attr('y', chartTop)
      .attr('width', barW).attr('height', chartH)
      .attr('rx', barR).attr('fill', 'rgba(255,255,255,0.06)');

    /* colored bar — animates up from bottom */
    svg.append('rect')
      .attr('x', cx - barW / 2)
      .attr('y', chartBottom)
      .attr('width', barW).attr('height', 0)
      .attr('rx', barR)
      .attr('fill', isDropoff ? 'url(#funnel-drop-grad)' : 'url(#funnel-grad)')
      .transition().duration(600).delay(i * 80)
      .attr('y', chartBottom - barH)
      .attr('height', barH);

    /* percentage label above bar */
    svg.append('text')
      .attr('x', cx).attr('y', chartBottom - barH - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F0EDE8').attr('font-size', '15').attr('font-weight', '600')
      .attr('font-family', 'Barlow Condensed, sans-serif')
      .attr('opacity', 0)
      .text(values[i] + '%')
      .transition().duration(300).delay(i * 80 + 400)
      .attr('opacity', 1);

    /* level label below */
    const shortLabel = lvl.length > 8 ? lvl.replace('Level', 'Lvl').replace('Manager', 'Mgr') : lvl;
    svg.append('text')
      .attr('x', cx).attr('y', chartBottom + 26)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.55)').attr('font-size', '14')
      .attr('font-family', 'Barlow Condensed, sans-serif')
      .text(shortLabel);
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
    .selectAll('text').attr('fill', '#9E9E9E').attr('font-size', '13');
  g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d + ' yrs'))
    .selectAll('text').attr('fill', '#9E9E9E').attr('font-size', '13');
  g.selectAll('.domain, line').attr('stroke', '#333');

  // Axis labels
  svg.append('text').attr('x', width / 2).attr('y', height - 4)
    .attr('text-anchor', 'middle').attr('fill', '#9E9E9E').attr('font-size', '15')
    .attr('font-family', 'Barlow Condensed').text('Pay Equity (cents per $1)');
  svg.append('text').attr('x', 14).attr('y', height / 2)
    .attr('text-anchor', 'middle').attr('fill', '#9E9E9E').attr('font-size', '15')
    .attr('font-family', 'Barlow Condensed')
    .attr('transform', `rotate(-90,14,${height / 2})`).text('Years to First Promotion (fewer = better)');

  const industryDotColors = {
    technology: '#5B93D3',
    'financial-services': '#48BB78',
    healthcare: '#4FD1C5',
    retail: '#ED8936',
    'public-sector': '#9F7AEA',
    manufacturing: '#A0AEC0'
  };

  const tooltip = d3.select(el).append('div').attr('class', 'scatter__tooltip');

  DATA.industries.forEach((ind) => {
    const cx = x(ind.metrics.pay);
    const cy = y(ind.metrics.growth);
    const dotColor = industryDotColors[ind.id] || '#C9B8E8';

    g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 0)
      .attr('fill', dotColor).attr('stroke', dotColor).attr('stroke-width', 2).attr('stroke-opacity', 0.4)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event) {
        d3.select(this).transition().duration(100).attr('r', 11);
        tooltip.style('opacity', 1)
          .html(`<strong>${ind.name}</strong><br>Pay Equity: $0.${ind.metrics.pay} per $1<br>Years to First Promo: ${ind.metrics.growth} yrs`)
          .style('left', (event.offsetX + 12) + 'px').style('top', (event.offsetY - 10) + 'px');
      })
      .on('mouseleave', function() {
        d3.select(this).transition().duration(100).attr('r', 7);
        tooltip.style('opacity', 0);
      })
      .transition().duration(400).delay(150).attr('r', 7);

    g.append('text').attr('x', cx).attr('y', cy - 18)
      .attr('text-anchor', 'middle').attr('fill', '#F0EDE8').attr('font-size', '11')
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
      if (worst.dim) {
        const pct = Math.round(worst.gap * 100);
        callout.textContent = `Below you'll see adjusted metrics for ${label} across each industry. The numbers show how pay, leadership, and career growth differ from the overall average for women. Their biggest disadvantage is in ${DATA.dimensionLabels[worst.dim]}, where outcomes are ${pct}% worse.`;
      } else {
        callout.textContent = `Below you'll see adjusted metrics for ${label} across each industry. This group meets or exceeds the average for women in every category — but the overall average still reflects a gap compared to men.`;
      }
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
    const icons = { pay: 'payments', leadership: 'trending_up', leave: 'child_care', growth: 'rocket_launch' };
    const btn = document.createElement('button');
    btn.className = 'toggle-btn';
    btn.innerHTML = `<span class="material-icons-outlined" style="font-size:1em;vertical-align:middle;margin-right:4px">${icons[dim]}</span>${DATA.dimensionLabels[dim]}`;
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
  initHeroStat();
  initHeroMarkers();
  renderScorecard();
  initFunnel();
  renderScatter();
  initRaceFilter();
  initFind();
}

document.addEventListener('DOMContentLoaded', init);
