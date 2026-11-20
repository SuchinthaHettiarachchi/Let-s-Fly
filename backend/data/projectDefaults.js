/*
 * Seed content for the Projects collection. Mirrors the visitor Projects page so
 * the CMS and the public site start from the same nine records and categories.
 */
const body = (paragraphs) => paragraphs.map((p) => `<p>${p}</p>`).join('');

const project = (slug, title, category, date, summary, extra = {}) => ({
  slug,
  title,
  category,
  date: `${date}-01`,
  summary,
  description: extra.description || body([summary]),
  cover: { src: extra.image || '', alt: title, name: '' },
  gallery: (extra.gallery || []).map((src) => ({ src, alt: title, name: '' })),
  status: 'published',
  sortOrder: extra.sortOrder ?? 0,
});

module.exports = [
  project(
    'annual-regional-conference-dubai',
    'Annual Regional Conference in Dubai',
    'conferences',
    '2026-09',
    'Flights, visas, hotel blocks and venue logistics for 140 delegates from four countries, with on-site coordinators from arrival to the closing dinner.',
    {
      image: '/images/hero/dubai.jpg',
      gallery: ['/images/hero/dubai.jpg'],
      description: body([
        'When a regional technology distributor brought its partners together for its annual conference, it needed one team to handle everything from first booking to the closing dinner. Over three days in Dubai, we hosted 140 delegates travelling from Sri Lanka, the Maldives, Bangladesh and Nepal.',
        'We arranged group air tickets on three airlines, processed every UAE visa and secured a block of 75 rooms within walking distance of the venue.',
        'Every delegate arrived and departed on schedule, and the client has already asked us to plan next year’s conference in Singapore.',
      ]),
      sortOrder: 1,
    },
  ),
  project('leadership-offsite-kandy', 'Leadership Offsite in Kandy', 'meetings', '2026-08',
    'Two days of strategy sessions for 40 senior managers at a hill-country resort, with meeting rooms, team dinners and transfers from Colombo.', { sortOrder: 2 }),
  project('sales-incentive-trip-bangkok', 'Sales Incentive Trip to Bangkok', 'incentives', '2026-07',
    'A four-day reward trip for 85 top performers, with chartered seats, a river cruise and a gala dinner overlooking the Chao Phraya.',
    { image: '/images/packages/bangkok-phuket.jpg', sortOrder: 3 }),
  project('corporate-awards-night-colombo', 'Corporate Awards Night in Colombo', 'meetings', '2026-06',
    'Venue, stage production and guest travel for a 300-guest annual awards ceremony, including out-of-town transfers and hotel stays.', { sortOrder: 4 }),
  project('partner-summit-colombo', 'Partner Summit in Colombo', 'conferences', '2026-05',
    'A one-day summit for 250 regional partners, with venue booking, keynote stage set-up, delegate registration and hotel stays.', { sortOrder: 5 }),
  project('singapore-science-tour', 'Singapore Science Tour for Students', 'incentives', '2026-04',
    'Five days of museums, labs and Sentosa for 60 students and teachers, with 24/7 on-trip coordinators and parent updates every evening.',
    { image: '/images/packages/singapore-malaysia-cruise.jpg', sortOrder: 6 }),
  project('travel-fair-2026', 'Let’s Fly Stand at Travel Fair 2026', 'exhibitions', '2026-03',
    'Our team met more than 2,000 visitors over three days, launching new Maldives and Japan packages with on-the-spot booking offers.', { sortOrder: 7 }),
  project('itb-asia-pavilion', 'Sri Lanka Pavilion at ITB Asia', 'exhibitions', '2026-02',
    'Stand design, shipping and travel for eight exhibitors sharing a Sri Lanka pavilion at the trade show in Singapore.', { sortOrder: 8 }),
  project('buddhist-circuit-india', 'Buddhist Circuit Pilgrimage to India', 'incentives', '2026-01',
    'A guided nine-day pilgrimage for 110 devotees to Bodh Gaya, Sarnath and Kushinagar, with flights, visas and ground transport arranged.', { sortOrder: 9 }),
];
