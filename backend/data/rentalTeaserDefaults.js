// Homepage "Car & bike rental" teaser — mirrors frontend rentalTypes (removed after migration).
module.exports = {
  key: 'home-rental-teaser',
  slots: [
    { id: 'cars', image: '/images/rentals/car.jpg', line1: 'Cars from', line2: 'LKR 8,500 / day' },
    { id: 'vans', image: '/images/rentals/van.jpg', line1: 'Vans from', line2: 'LKR 14,000 / day' },
    { id: 'bikes', image: '/images/rentals/bike.jpg', line1: 'Bikes from', line2: 'LKR 4,500 / day' },
    { id: 'scooters', image: '/images/rentals/scooter.jpg', line1: 'Scooters from', line2: 'LKR 3,000 / day' },
  ],
};
