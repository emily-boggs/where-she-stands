/**
 * WHERE SHE STANDS — Data Layer
 * All illustrative data for the interactive story.
 * Single source of truth for charts and UI.
 */

const DATA = {
  dimensions: ['pay', 'leadership', 'leave', 'growth'],

  dimensionLabels: {
    pay: 'Pay Equity',
    leadership: 'Leadership Representation',
    leave: 'Family Leave Culture',
    growth: 'Career Growth'
  },

  industries: [
    {
      id: 'technology',
      name: 'Technology',
      scores: { pay: 72, leadership: 38, leave: 65, growth: 80 }
    },
    {
      id: 'financial-services',
      name: 'Financial Services',
      scores: { pay: 68, leadership: 30, leave: 50, growth: 70 }
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      scores: { pay: 78, leadership: 55, leave: 72, growth: 60 }
    },
    {
      id: 'retail',
      name: 'Retail & Consumer Goods',
      scores: { pay: 62, leadership: 42, leave: 45, growth: 50 }
    },
    {
      id: 'public-sector',
      name: 'Public Sector',
      scores: { pay: 85, leadership: 48, leave: 80, growth: 40 }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      scores: { pay: 58, leadership: 20, leave: 40, growth: 45 }
    }
  ],

  /**
   * Pipeline data: % women at each career level
   * Used by the funnel chart
   */
  pipeline: {
    levels: ['Entry Level', 'Mid-Level', 'Senior', 'VP', 'C-Suite'],
    byIndustry: {
      technology:          [47, 38, 27, 18, 12],
      'financial-services': [52, 40, 30, 22, 14],
      healthcare:          [72, 62, 50, 38, 28],
      retail:              [55, 45, 35, 25, 18],
      'public-sector':     [58, 50, 42, 35, 26],
      manufacturing:       [30, 22, 15, 10, 6]
    }
  },

  /**
   * Race/ethnicity multipliers — applied to base scores.
   * Shows how gaps widen for women of color.
   * A multiplier of 0.75 means the score drops to 75% of the base.
   */
  raceModifiers: {
    all:      { pay: 1.00, leadership: 1.00, leave: 1.00, growth: 1.00 },
    white:    { pay: 1.05, leadership: 1.10, leave: 1.02, growth: 1.05 },
    black:    { pay: 0.82, leadership: 0.70, leave: 0.90, growth: 0.78 },
    hispanic: { pay: 0.78, leadership: 0.65, leave: 0.85, growth: 0.75 },
    asian:    { pay: 0.95, leadership: 0.75, leave: 0.95, growth: 0.90 }
  },

  raceLabels: {
    all: 'All Women (Average)',
    white: 'White Women',
    black: 'Black Women',
    hispanic: 'Hispanic/Latina Women',
    asian: 'Asian Women'
  },

  /**
   * Persona vignettes
   */
  personas: [
    {
      name: 'Maya',
      age: 27,
      situation: 'Considering a pivot from Tech to Healthcare',
      priorities: ['growth', 'pay'],
      quote: 'I want to grow fast, but not at the cost of being the only woman in the room.'
    },
    {
      name: 'Diane',
      age: 34,
      situation: 'Leaving Finance for Public Sector after having a baby',
      priorities: ['leave', 'leadership'],
      quote: 'I shouldn't have to choose between being a mom and being a leader.'
    },
    {
      name: 'Carmen',
      age: 22,
      situation: 'First job — choosing between Manufacturing and Retail',
      priorities: ['growth', 'leadership'],
      quote: 'I want to see someone who looks like me at the top before I commit.'
    }
  ]
};
