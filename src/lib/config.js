export const COLORS = {
  primary: '#0F172A',
  accent: '#1E3A8A',
  amber: '#D97706',
  emerald: '#15803D',
  slate: '#64748B',
  red: '#B91C1C',
};

export const PIE_COLORS = ['#1E3A8A', '#15803D', '#D97706'];

export const FALLBACK_SUGGESTIONS = [
  {
    whyReasons: [
      'High population density in the region leading to increased service demand',
      'Recent government mandate requiring Aadhaar updates for welfare schemes',
      'Migration patterns causing address change requirements',
    ],
    actions: [
      'Deploy additional mobile enrollment units to the district',
      'Extend operating hours at existing Aadhaar centers',
      'Set up temporary camps in high-traffic areas',
    ],
  },
  {
    whyReasons: [
      'Upcoming elections requiring updated voter ID linkage',
      'Bank account linking deadlines approaching',
      'School enrollment season requiring child Aadhaar updates',
    ],
    actions: [
      'Coordinate with local banks for on-site enrollment drives',
      'Partner with schools for children Aadhaar camps',
      'Increase awareness campaigns about update procedures',
    ],
  },
  {
    whyReasons: [
      'New biometric update requirements for senior citizens',
      'SIM card re-verification drives by telecom operators',
      'Healthcare scheme registrations requiring Aadhaar linkage',
    ],
    actions: [
      'Set up dedicated counters for elderly residents',
      'Collaborate with telecom providers for joint camps',
      'Streamline document verification process',
    ],
  },
  {
    whyReasons: [
      'Post-pandemic recovery leading to delayed updates catching up',
      'New housing developments requiring fresh address registrations',
      'LPG subsidy scheme updates requiring Aadhaar verification',
    ],
    actions: [
      'Prioritize address update requests to reduce backlog',
      'Deploy staff to new residential areas',
      'Coordinate with gas agencies for bulk processing',
    ],
  },
  {
    whyReasons: [
      'Employment verification requirements from IT sector companies',
      'Passport application surge requiring Aadhaar updates',
      'Insurance policy linkage deadlines approaching',
    ],
    actions: [
      'Set up corporate enrollment partnerships',
      'Coordinate with passport offices for integrated services',
      'Extend weekend operations at major centers',
    ],
  },
  {
    whyReasons: [
      'Agricultural subsidy disbursement requiring farmer Aadhaar updates',
      'Rural employment guarantee scheme registrations',
      'Seasonal migration patterns from agricultural regions',
    ],
    actions: [
      'Deploy mobile vans to rural and farming communities',
      'Coordinate with agriculture department for farmer camps',
      'Set up enrollment points at mandis and agricultural markets',
    ],
  },
  {
    whyReasons: [
      'Marriage registrations leading to name change updates',
      'College admission season requiring student verification',
      'Property registration mandates requiring Aadhaar proof',
    ],
    actions: [
      'Expedite name change request processing',
      'Partner with universities for student enrollment drives',
      'Set up counters at sub-registrar offices',
    ],
  },
];

export const BRAND_NAMES = [
  { lang: 'English', name: 'Pehchaan Index' },
  { lang: 'Hindi', name: 'पहचान सूचकांक' },
  { lang: 'Tamil', name: 'அடையாள குறியீடு' },
  { lang: 'Bengali', name: 'পরিचय सूचक' },
  { lang: 'Telugu', name: 'గుర్తింపు సూచిక' },
];

export const cardHoverProps = {
  whileHover: { y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' },
  transition: { type: 'spring', stiffness: 400, damping: 25 }
};

export const amberCardHoverProps = {
  whileHover: { y: -4, boxShadow: '0 20px 50px rgba(217,119,6,0.25)' },
  transition: { type: 'spring', stiffness: 400, damping: 25 }
};

export const mobileCardProps = {
  transition: { duration: 0 }
};
