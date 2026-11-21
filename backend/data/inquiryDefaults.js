/* Sample inquiries so the CMS list is populated before the first visitor submission. */
const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString();

module.exports = [
  {
    customerName: 'Amelia Perera',
    email: 'amelia.perera@example.com',
    phone: '+94 77 123 4567',
    category: 'Plan my Trip Section',
    subject: 'Family holiday to Japan',
    message: 'We are planning a family holiday to Japan for two adults and two children in December. Could you share package options and estimated costs?',
    status: 'New',
    comments: [],
    createdAt: daysAgo(1),
  },
  {
    customerName: 'Daniel Fernando',
    email: 'daniel.fernando@example.com',
    phone: '+94 71 234 5678',
    category: 'Air Ticket',
    subject: 'Air ticket enquiry',
    message: 'Looking for the best fare from Colombo to Dubai in the second week of next month.',
    status: 'In Progress',
    comments: ['Shared three fare options with the customer.'],
    createdAt: daysAgo(2),
  },
  {
    customerName: 'Nisha Jayawardena',
    email: 'nisha.j@example.com',
    phone: '+94 77 987 6543',
    category: 'Visa Inquiry',
    subject: 'Visa enquiry',
    message: 'Please confirm the documents needed for a UAE tourist visa for a family of four.',
    status: 'New',
    comments: [],
    createdAt: daysAgo(3),
  },
  {
    customerName: 'Kavinda Silva',
    email: 'kavinda.silva@example.com',
    phone: '+94 76 555 1234',
    category: 'Contact',
    subject: 'General enquiry',
    message: 'Could you send over your office address and opening hours?',
    status: 'Closed',
    comments: [],
    createdAt: daysAgo(4),
  },
];
