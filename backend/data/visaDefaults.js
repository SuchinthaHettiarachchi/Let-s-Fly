const visaCategories = [
  { key: 'tourist-visa', label: 'Tourist Visa', sortOrder: 0 },
  { key: 'travel-visa', label: 'Travel Visa', sortOrder: 1 },
  { key: 'business-visa', label: 'Business Visa', sortOrder: 2 },
];

const visaCountries = [
  { key: 'united-arab-emirates', label: 'United Arab Emirates', sortOrder: 0 },
  { key: 'maldives', label: 'Maldives', sortOrder: 1 },
  { key: 'thailand', label: 'Thailand', sortOrder: 2 },
];

const visas = [
  {
    slug: 'dubai',
    countryKey: 'united-arab-emirates',
    country: 'United Arab Emirates',
    city: 'Dubai',
    categoryKey: 'tourist-visa',
    type: 'Tourist Visa',
    image: '/images/hero/dubai.jpg',
    flag: '/images/flags/ae.svg',
    summary:
      'UAE tourist visa for holidays and family visits to Dubai. We check your documents, apply on your behalf and send your eVisa straight to WhatsApp.',
    facts: [
      { icon: 'schedule', label: 'Processing 3 to 5 working days' },
      { icon: 'calendar_month', label: '30 or 60 day stay' },
      { icon: 'badge', label: 'eVisa · single entry' },
    ],
    documentGroups: [
      {
        title: 'General Requirements',
        items: [
          { title: 'Valid passport', note: "At least 6 months' validity from your arrival date in the UAE" },
          { title: 'Colour scan of the passport bio page', note: 'Clear and uncropped, with no glare on the photo' },
          { title: 'Recent passport-size photograph', note: 'White background, taken within the last 6 months' },
          { title: 'National Identity Card (NIC) copy' },
          { title: 'Confirmed return flight ticket' },
          {
            title: 'Hotel booking or host address in the UAE',
            note: "If staying with family, a copy of the host's Emirates ID and residence visa",
          },
          { title: 'Personal bank statements for the last 3 months' },
          { title: 'Employment letter on company letterhead', note: 'Stating position, salary and approved leave dates' },
        ],
      },
      {
        title: 'If Applicant Is Self Employed',
        items: [
          { title: 'Business Registration Certificate', note: 'Certified copy, in place of the employment letter' },
          { title: 'Business bank statements for the last 3 months' },
          { title: 'Form 1 / Form 20 (for companies)', note: 'Showing directors and shareholding' },
          { title: 'Income tax file or latest tax payment receipt' },
          { title: 'Letter on business letterhead confirming travel dates', note: 'Signed by the applicant as owner or director' },
        ],
      },
    ],
    warning:
      'UAE immigration can ask for extra documents or a refundable deposit. Talk to us before you book non-refundable travel.',
    feeGroups: [],
    extraSections: [],
    sortOrder: 0,
  },
  {
    slug: 'maldives',
    countryKey: 'maldives',
    country: 'Maldives',
    city: 'Malé',
    categoryKey: 'travel-visa',
    type: 'Travel Visa',
    image: '/images/packages/maldives-overwater-villa.jpg',
    flag: '',
    summary: '',
    facts: [],
    documentGroups: [],
    warning: '',
    feeGroups: [],
    extraSections: [],
    sortOrder: 1,
  },
  {
    slug: 'thailand',
    countryKey: 'thailand',
    country: 'Thailand',
    city: 'Bangkok',
    categoryKey: 'travel-visa',
    type: 'Travel Visa',
    image: '/images/packages/bangkok-phuket.jpg',
    flag: '',
    summary: '',
    facts: [],
    documentGroups: [],
    warning: '',
    feeGroups: [],
    extraSections: [],
    sortOrder: 2,
  },
];

const visaSteps = [
  { title: 'Share details', text: 'Tell us your destination and travel dates.' },
  { title: 'Document check', text: 'We review everything and flag gaps.' },
  { title: 'We submit', text: 'Forms, fees and appointment, all handled.' },
  { title: 'Visa in hand', text: 'Track progress on WhatsApp until approval.' },
];

const sriLankaVisas = [
  {
    name: 'Tourist Visit Visa',
    short: 'Tourist Visa',
    icon: 'beach_access',
    image: '/images/hero/pexels-marina-zvada-844583049-35606862.jpg',
    text: 'For holidays and leisure travel across the island.',
    purposes: ['Holidays & sightseeing', 'Visiting family or friends', 'Yoga & Ayurvedic treatment', 'Sporting & cultural events'],
    facts: [
      { label: 'Standard ETA', value: '30 days' },
      { label: 'Entries', value: 'Double' },
      { label: 'Extendable up to', value: '270 days' },
    ],
  },
  {
    name: 'Business Purpose Visa',
    short: 'Business Visa',
    icon: 'work',
    image: '/images/visa/business-conference.jpg',
    text: 'For short business visits to Sri Lanka.',
    purposes: ['Business meetings', 'Negotiations', 'Conferences & symposiums', 'Short-term training'],
    facts: [
      { label: 'Purpose', value: 'Business' },
      { label: 'Training length', value: '< 1 month' },
      { label: 'Application', value: 'ETA' },
    ],
  },
];

const residenceCategories = [
  {
    title: 'Employment Category',
    icon: 'badge',
    text: 'For personnel working on Board of Investment (BOI) projects, banks, or approved private sector organisations.',
  },
  {
    title: 'Investor Category',
    icon: 'trending_up',
    text: 'For foreign nationals making qualifying capital investments in Sri Lanka.',
    highlight: 'From USD 100,000 · 5-year visa',
  },
  {
    title: 'Student Category',
    icon: 'school',
    text: 'For approved courses at educational institutions, or recognised volunteer and intern programmes.',
  },
  {
    title: 'Family / Spouse Category',
    icon: 'family_restroom',
    text: 'For spouses and dependents of Sri Lankan citizens or primary visa holders.',
  },
  {
    title: 'Digital Nomad Visa',
    icon: 'laptop_mac',
    text: 'Lets remote workers legally live in Sri Lanka while working for foreign employers.',
  },
];

const visaPageDefaults = {
  key: 'visa-page',
  outboundEyebrow: 'Popular visas',
  outboundTitle: 'Where Sri Lankans are heading',
  inboundEyebrow: 'Sri Lankan visa types',
  inboundTitle: 'Coming to Sri Lanka? Find the right visa',
  inboundIntro:
    "Whether you're here for a holiday, a business trip or a longer stay, we'll match you to the right visa, prepare your application and keep you updated until it's approved.",
  residenceEyebrow: 'Long-term stay',
  residenceTitle: 'Residence Visa',
  residenceDescription:
    'Designed for foreign nationals who wish to stay in Sri Lanka for an extended period. Choose the category that matches your reason for staying.',
  residenceRenewalTitle: 'Renewed annually',
  residenceRenewalText:
    "We handle your yearly renewal through Let's Fly.lk, so you never miss a deadline.",
  rulesNote:
    "Visa rules and fees are set by Sri Lanka's Department of Immigration & Emigration and can change. We confirm the current requirements for your case before you apply.",
  stepsEyebrow: 'How it works',
  stepsTitle: 'Four steps to your visa',
  steps: visaSteps,
  sriLankaVisas,
  residenceCategories,
};

module.exports = { visaCategories, visaCountries, visas, visaPageDefaults };
