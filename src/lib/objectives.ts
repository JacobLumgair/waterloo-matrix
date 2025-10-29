// objectives.ts
// Centralized objectives for the City of Waterloo Strategic Plan (2023–2026) and the City of Waterloo Economic Development Strategy (2019–2024).
// This file is generated to support matrix-based analysis and planning UIs.

export type EDSObjective = {
  id: `EDS-${number}`;
  group: 'Start+Attract' | 'Preserve+Grow' | 'Organize+Empower';
  title: string;
  compact: string;
  tags: string[];
};

export type SPObjective = {
  id: `SP${number}-${number}`;
  priority:
    | 'READI'
    | 'Environmental Sustainability & Climate Action'
    | 'Complete Community'
    | 'Infrastructure & Transportation Systems'
    | 'Innovation & Future-Ready';
  number: number; // objective number within the priority
  title: string;
  compact: string;
  tags: string[];
};

export const EDS_OBJECTIVES: EDSObjective[] = [
  { id: 'EDS-1', group: 'Start+Attract', title: 'Enhance start-up and emerging arts and cultural industry support', compact: 'Support start-ups and emerging arts/culture ventures with programming and services.', tags: ['startups', 'arts & culture', 'entrepreneurship', 'support'] },
  { id: 'EDS-2', group: 'Start+Attract', title: 'Enhance investment attraction through targeted outreach', compact: 'Use proactive outreach and promotion to attract new firms and investment.', tags: ['investment attraction', 'outreach', 'prospecting'] },
  { id: 'EDS-3', group: 'Start+Attract', title: 'Improve investment readiness', compact: 'Strengthen sites, permitting and data to be investor-ready.', tags: ['readiness', 'sites', 'permits', 'data'] },
  { id: 'EDS-4', group: 'Start+Attract', title: 'Support strategic talent attraction', compact: 'Help employers attract and retain talent; market Waterloo to workers.', tags: ['talent', 'workforce', 'attraction', 'retention'] },
  { id: 'EDS-5', group: 'Preserve+Grow', title: 'Bolster business retention and expansion programming', compact: 'Expand BR&E to safeguard and grow existing firms.', tags: ['BR&E', 'retention', 'expansion', 'existing firms'] },
  { id: 'EDS-6', group: 'Preserve+Grow', title: 'Enhance development of creative spaces', compact: 'Enable workspace and creative spaces to support growth.', tags: ['creative spaces', 'workspace', 'placemaking'] },
  { id: 'EDS-7', group: 'Organize+Empower', title: 'Encourage increased diversity in local industries', compact: 'Broaden the industrial mix and support inclusive participation.', tags: ['industry mix', 'diversity', 'inclusive growth'] },
  { id: 'EDS-8', group: 'Organize+Empower', title: 'Showcase that Waterloo is a complete community', compact: 'Promote amenities, livability and place-brand to investors and talent.', tags: ['complete community', 'marketing', 'livability', 'brand'] },
  { id: 'EDS-9', group: 'Organize+Empower', title: 'Enhance quality of life and quality of place', compact: 'Invest in placemaking and quality-of-life assets that underpin growth.', tags: ['quality of life', 'quality of place', 'placemaking'] },
] as const;

export const STRATEGIC_PLAN_OBJECTIVES: SPObjective[] = [
  // Priority 1 — READI
  { id: 'SP1-1', priority: 'READI', number: 1, title: 'Invest in accessibility and inclusion to enhance belonging', compact: 'Invest in accessibility and inclusion across city facilities, operations and services to strengthen belonging.', tags: ['accessibility', 'inclusion', 'belonging'] },
  { id: 'SP1-2', priority: 'READI', number: 2, title: 'Embed Reconciliation, equity, accessibility, diversity and inclusion across the organization', compact: 'Embed READI principles into policies, practices and decision-making; strengthen alliances with community partners.', tags: ['RECONCILIATION', 'equity', 'policy', 'governance'] },
  { id: 'SP1-3', priority: 'READI', number: 3, title: 'Advance Reconciliation', compact: 'Act on TRC Calls to Action and related frameworks; build trust with Indigenous partners.', tags: ['Reconciliation', 'Indigenous partnerships', 'TRC'] },
  { id: 'SP1-4', priority: 'READI', number: 4, title: 'Action anti-racism', compact: 'Proactively respond to identity-based hate and dismantle systemic racism.', tags: ['anti-racism', 'human rights', 'inclusion'] },

  // Priority 2 — Environmental Sustainability & Climate Action
  { id: 'SP2-1', priority: 'Environmental Sustainability & Climate Action', number: 1, title: 'Climate leadership', compact: 'Align organizational and community action to meet mitigation/adaptation goals; electrify fleet and retrofit facilities.', tags: ['climate action', 'mitigation', 'adaptation', 'GHG'] },
  { id: 'SP2-2', priority: 'Environmental Sustainability & Climate Action', number: 2, title: 'Environmentally sustainable economy', compact: 'Encourage environmentally sustainable development practices (e.g., Generation Park standards).', tags: ['sustainable development', 'economy', 'standards'] },
  { id: 'SP2-3', priority: 'Environmental Sustainability & Climate Action', number: 3, title: 'Environmental sustainability mindset', compact: 'Embed environmental sustainability into internal decisions and community education.', tags: ['mindset', 'operations', 'education'] },

  // Priority 3 — Complete Community
  { id: 'SP3-1', priority: 'Complete Community', number: 1, title: 'Invest in arts experiences', compact: 'Invest in arts events and museum strategy to create safe, vibrant public spaces.', tags: ['arts', 'culture', 'museum', 'public spaces'] },
  { id: 'SP3-2', priority: 'Complete Community', number: 2, title: 'Vibrant public spaces', compact: 'Plan for context-sensitive intensification and welcoming, accessible spaces that reduce car dependence.', tags: ['public realm', 'intensification', 'accessibility', 'mobility'] },
  { id: 'SP3-3', priority: 'Complete Community', number: 3, title: 'Complete neighbourhoods', compact: 'Coordinate on housing initiatives and implement the Affordable Housing Strategy and Housing Pledge.', tags: ['housing', 'affordability', 'neighbourhoods'] },
  { id: 'SP3-4', priority: 'Complete Community', number: 4, title: 'Actions to meet community needs', compact: 'Optimize City-owned lands, renew grants, and expand inclusive programs and amenities.', tags: ['community needs', 'land use', 'grants', 'programs'] },

  // Priority 4 — Infrastructure & Transportation Systems
  { id: 'SP4-1', priority: 'Infrastructure & Transportation Systems', number: 1, title: 'Sustainable infrastructure planning', compact: 'Prioritize sustainable, resilient infrastructure; assess and address gaps and life-cycle costs.', tags: ['infrastructure', 'resilience', 'planning'] },
  { id: 'SP4-2', priority: 'Infrastructure & Transportation Systems', number: 2, title: 'Mobility and a connected community', compact: 'Advance Vision Zero and expand year-round transportation options and regional connections.', tags: ['mobility', 'Vision Zero', 'connectivity', 'transportation'] },
  { id: 'SP4-3', priority: 'Infrastructure & Transportation Systems', number: 3, title: 'Investment in active transportation', compact: 'Expand active transportation networks and improve cycling/pedestrian safety.', tags: ['active transportation', 'cycling', 'walking', 'safety'] },

  // Priority 5 — Innovation & Future-Ready
  { id: 'SP5-1', priority: 'Innovation & Future-Ready', number: 1, title: 'Support a diversified economy and innovation ecosystem', compact: 'Support a healthy, diverse economy by partnering with post-secondary, not-for-profit and business sectors.', tags: ['innovation ecosystem', 'diversification', 'partnerships'] },
  { id: 'SP5-2', priority: 'Innovation & Future-Ready', number: 2, title: 'Partner for social innovation', compact: 'Collaborate on social innovation, including healthcare advocacy and Community Safety & Wellbeing actions.', tags: ['social innovation', 'healthcare', 'CSWB'] },
  { id: 'SP5-3', priority: 'Innovation & Future-Ready', number: 3, title: 'Digital opportunities for the future', compact: 'Identify and align digital opportunities that improve customer service and accessibility.', tags: ['digital', 'customer service', 'accessibility'] },
] as const;

// Helpful lookups
export const EDS_BY_ID = Object.fromEntries(EDS_OBJECTIVES.map(o => [o.id, o]));
export const SP_BY_ID = Object.fromEntries(STRATEGIC_PLAN_OBJECTIVES.map(o => [o.id, o]));

// Grouping helpers
export const EDS_BY_GROUP = EDS_OBJECTIVES.reduce<Record<EDSObjective['group'], EDSObjective[]>>((acc, o) => {
  (acc[o.group] ||= []).push(o);
  return acc;
}, {
  'Start+Attract': [],
  'Preserve+Grow': [],
  'Organize+Empower': [],
});

export const SP_BY_PRIORITY = STRATEGIC_PLAN_OBJECTIVES.reduce<Record<SPObjective['priority'], SPObjective[]>>((acc, o) => {
  (acc[o.priority] ||= []).push(o);
  return acc;
}, {
  'READI': [],
  'Environmental Sustainability & Climate Action': [],
  'Complete Community': [],
  'Infrastructure & Transportation Systems': [],
  'Innovation & Future-Ready': [],
});
