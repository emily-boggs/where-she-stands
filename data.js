/**
 * WHERE SHE STANDS — Data Layer
 * All data is illustrative (not from live sources).
 * Metrics use real-world units so readers understand what they mean.
 */

const DATA = {
  dimensions: ['pay', 'leadership', 'leave', 'growth'],

  dimensionLabels: {
    pay: 'Pay Equity',
    leadership: 'Leadership',
    leave: 'Family Leave',
    growth: 'Career Growth'
  },

  dimensionUnits: {
    pay: '¢ per $1',
    leadership: '% women in C-suite',
    leave: 'weeks paid leave',
    growth: 'yrs to promotion'
  },

  dimensionDescriptions: {
    pay: 'For every dollar a man earns, women earn:',
    leadership: 'C-suite and senior roles held by women:',
    leave: 'Avg paid parental leave offered:',
    growth: 'Avg years to first management promotion:'
  },

  /** Lower is better for growth (fewer years) */
  lowerIsBetter: { pay: false, leadership: false, leave: false, growth: true },

  industries: [
    {
      id: 'technology',
      name: 'Technology',
      metrics: { pay: 83, leadership: 14, leave: 12, growth: 6.2 }
    },
    {
      id: 'financial-services',
      name: 'Financial Services',
      metrics: { pay: 79, leadership: 11, leave: 8, growth: 7.1 }
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      metrics: { pay: 88, leadership: 26, leave: 14, growth: 5.0 }
    },
    {
      id: 'retail',
      name: 'Retail & Consumer Goods',
      metrics: { pay: 75, leadership: 18, leave: 6, growth: 6.8 }
    },
    {
      id: 'public-sector',
      name: 'Public Sector',
      metrics: { pay: 92, leadership: 22, leave: 16, growth: 8.5 }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      metrics: { pay: 72, leadership: 8, leave: 5, growth: 9.0 }
    }
  ],

  formatMetric(dim, value) {
    switch (dim) {
      case 'pay': return `$0.${value}`;
      case 'leadership': return `${value}%`;
      case 'leave': return `${value} wks`;
      case 'growth': return `${value} yrs`;
      default: return String(value);
    }
  },

  pipeline: {
    levels: ['Entry Level', 'Mid-Level', 'Senior Manager', 'VP', 'C-Suite'],
    byIndustry: {
      technology:           [47, 38, 27, 18, 14],
      'financial-services': [52, 40, 30, 22, 11],
      healthcare:           [72, 62, 50, 38, 26],
      retail:               [55, 45, 35, 25, 18],
      'public-sector':      [58, 50, 42, 35, 22],
      manufacturing:        [30, 22, 15, 10, 8]
    }
  },

  raceModifiers: {
    all:      { pay: 1.00, leadership: 1.00, leave: 1.00, growth: 1.00 },
    white:    { pay: 1.05, leadership: 1.10, leave: 1.00, growth: 0.92 },
    black:    { pay: 0.79, leadership: 0.65, leave: 1.00, growth: 1.30 },
    hispanic: { pay: 0.75, leadership: 0.60, leave: 1.00, growth: 1.35 },
    asian:    { pay: 0.95, leadership: 0.72, leave: 1.00, growth: 1.10 }
  },

  raceLabels: {
    all: 'All Women (Average)',
    white: 'White Women',
    black: 'Black Women',
    hispanic: 'Hispanic / Latina Women',
    asian: 'Asian Women'
  },

  personas: [
    {
      id: 'maya',
      name: 'Maya Chen',
      age: 27,
      role: 'Software Engineer',
      location: 'San Francisco, CA',
      situation: 'Considering a pivot from Tech to Healthcare',
      priorities: ['growth', 'pay'],
      identity: 'asian',
      quote: "I want to grow fast, but not at the cost of being the only woman in the room who looks like me.",
      story: [
        "Maya graduated top of her class from UC Berkeley with a CS degree. Within two years at a major tech company, she'd shipped three products — but noticed something: every meeting she walked into had the same composition. Mostly men. Almost no other Asian women in leadership.",
        "Her manager, well-meaning, kept assigning her to execution roles rather than strategy. When she asked about a path to principal engineer, the answer was always 'give it time.' Her male peers with the same tenure were already there.",
        "A friend in healthcare IT told her about a director role at a hospital system. The pay was 8% less, but the leadership pipeline looked completely different — 26% women in senior roles versus 14% in tech. For Maya, that visibility mattered more than the salary delta.",
        "She's still deciding. The tech company countered with a retention package. But Maya keeps coming back to one question: where will she actually get to lead?"
      ],
      dataInsight: "In Tech, Asian women earn $0.79 for every dollar white men earn and hold only 10% of leadership roles — despite making up 25% of the technical workforce."
    },
    {
      id: 'diane',
      name: 'Diane Okafor',
      age: 34,
      role: 'VP of Operations, Financial Services',
      location: 'Chicago, IL',
      situation: 'Leaving Finance for Public Sector after having a baby',
      priorities: ['leave', 'leadership'],
      identity: 'black',
      quote: "I shouldn't have to choose between being a mom and being a leader.",
      story: [
        "Diane was one of three Black women at the VP level in her entire 4,000-person financial services firm. She'd fought for every inch of that title — twelve-hour days, missed holidays, a relentless climb through a system that wasn't built for her.",
        "Then she got pregnant. Her company offered 8 weeks of paid leave. Her doctor recommended 12. She took 10 and came back to find her direct reports had been reassigned. 'We needed coverage,' her boss said. It took six months to rebuild her team.",
        "A former colleague now at a federal agency told her about a role with 16 weeks of paid leave, flex schedules, and — critically — Black women at every level of the org chart. The salary was lower. The dignity was higher.",
        "Diane made the switch. She says she doesn't miss the money. She misses it least on the days she picks up her daughter from daycare at 5:30 instead of 8."
      ],
      dataInsight: "Black women in Financial Services earn $0.62 for every dollar white men earn. In Public Sector, that gap narrows to $0.73 — and leadership representation is nearly double."
    },
    {
      id: 'carmen',
      name: 'Carmen Reyes',
      age: 22,
      role: 'Recent Graduate, Supply Chain Management',
      location: 'Houston, TX',
      situation: 'First job: choosing between Manufacturing and Retail',
      priorities: ['growth', 'leadership'],
      identity: 'hispanic',
      quote: "I want to see someone who looks like me at the top before I commit ten years of my life.",
      story: [
        "Carmen is the first in her family to graduate from college. She has a degree in supply chain management from the University of Houston and two offers on her desk: a logistics coordinator role at a manufacturing firm, and a buyer position at a national retail chain.",
        "The manufacturing job pays $4,000 more. But Carmen looked up the company's leadership page — 48 faces, all men, 46 of them white. The retail company wasn't perfect, but their VP of Supply Chain was a Latina woman from El Paso.",
        "Her father told her to take the money. Her older sister — who'd spent five years at a manufacturing plant before burning out — told her to think about where she'd be in ten years, not ten months.",
        "Carmen chose retail. On her first day, the VP she'd admired online stopped by her desk and said: 'Welcome. We need more of us here.' It was the first time Carmen felt like she wasn't borrowing space."
      ],
      dataInsight: "In Manufacturing, Hispanic women hold just 5% of management roles and face the longest path to promotion — 12 years on average. In Retail, that drops to 7 years with nearly triple the representation."
    }
  ],

  careerStages: [
    { id: 'early', label: 'Early Career', description: 'Just starting out or < 3 years' },
    { id: 'mid', label: 'Mid-Career', description: '3–10 years of experience' },
    { id: 'senior', label: 'Senior / Leadership', description: '10+ years, eyeing the top' },
    { id: 'pivot', label: 'Career Pivot', description: 'Switching industries or roles' }
  ],

  jobLinks: {
    technology: {
      linkedin: 'https://www.linkedin.com/jobs/search/?keywords=technology',
      indeed: 'https://www.indeed.com/jobs?q=technology'
    },
    'financial-services': {
      linkedin: 'https://www.linkedin.com/jobs/search/?keywords=financial%20services',
      indeed: 'https://www.indeed.com/jobs?q=financial+services'
    },
    healthcare: {
      linkedin: 'https://www.linkedin.com/jobs/search/?keywords=healthcare',
      indeed: 'https://www.indeed.com/jobs?q=healthcare'
    },
    retail: {
      linkedin: 'https://www.linkedin.com/jobs/search/?keywords=retail%20consumer%20goods',
      indeed: 'https://www.indeed.com/jobs?q=retail+consumer+goods'
    },
    'public-sector': {
      linkedin: 'https://www.linkedin.com/jobs/search/?keywords=government%20public%20sector',
      indeed: 'https://www.usajobs.gov/'
    },
    manufacturing: {
      linkedin: 'https://www.linkedin.com/jobs/search/?keywords=manufacturing',
      indeed: 'https://www.indeed.com/jobs?q=manufacturing'
    }
  }
};
