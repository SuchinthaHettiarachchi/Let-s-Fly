const contentDefaults = {
  key: 'air-tickets',
  photo: '',
  title: 'Book your flight on our booking portal',
  description:
    "Built by the Let's Fly.lk team, our portal lets you compare live fares, pick seats and pay securely, all in one place.",
  phoneNumber: '+94 77 831 6020',
};

const routeDefaults = [
  { startLocation: 'Colombo', endLocation: 'Dubai', pricePerPerson: 118000, image: '/images/packages/dubai-family-escape.jpg', sortOrder: 1 },
  { startLocation: 'Colombo', endLocation: 'Malé', pricePerPerson: 62500, image: '/images/packages/maldives-overwater-villa.jpg', sortOrder: 2 },
  { startLocation: 'Colombo', endLocation: 'Bangkok', pricePerPerson: 96000, image: '/images/packages/bangkok-phuket.jpg', sortOrder: 3 },
  { startLocation: 'Colombo', endLocation: 'Singapore', pricePerPerson: 104000, image: '/images/packages/singapore-malaysia-cruise.jpg', sortOrder: 4 },
  { startLocation: 'Colombo', endLocation: 'Paris', pricePerPerson: 265000, image: '', sortOrder: 5 },
  { startLocation: 'Colombo', endLocation: 'Tokyo', pricePerPerson: 238000, image: '', sortOrder: 6 },
];

module.exports = { contentDefaults, routeDefaults };
