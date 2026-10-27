const bcrypt = require('bcryptjs');
const db = require('./utils/db');

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=70`;

// Runs only when there are no properties yet. Demo login: demo@estate.com / demo123
module.exports = function seed() {
  const d = db.read();
  if (d.properties.length) return;

  const owner = {
    id: 'u-demo', name: 'Demo Agent', email: 'demo@estate.com', phone: '+1 555 010 2030',
    passwordHash: bcrypt.hashSync('demo123', 10), favorites: [], createdAt: new Date().toISOString(),
  };
  if (!d.users.some((u) => u.id === owner.id)) d.users.push(owner);

  const mk = (i, o) => ({
    id: 'p-' + i, ownerId: owner.id, ownerName: owner.name, ownerEmail: owner.email, ownerPhone: owner.phone,
    createdAt: new Date(Date.now() - i * 864e5).toISOString(), ...o,
  });

  d.properties = [
    mk(1, { title: 'Modern Family Home with Garden', description: 'Bright open-plan living, chef kitchen, and a landscaped backyard in a quiet, family-friendly street close to schools and parks.', price: 485000, listingType: 'sale', type: 'house', bedrooms: 4, bathrooms: 3, area: 2400, city: 'Austin', address: '12 Maple Street', images: [img('photo-1568605114967-8130f3a36994'), img('photo-1600596542815-ffad4c1539a9')], amenities: ['Garden', 'Garage', 'Fireplace', 'Solar Panels'] }),
    mk(2, { title: 'Downtown Luxury Apartment', description: 'High-floor apartment with floor-to-ceiling windows, skyline views and a full-service concierge.', price: 3200, listingType: 'rent', type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100, city: 'Chicago', address: '88 Lakeshore Drive', images: [img('photo-1545324418-cc1a3fa10c00'), img('photo-1502672260266-1c1ef2d93688')], amenities: ['Gym', 'Pool', 'Concierge', 'Parking'] }),
    mk(3, { title: 'Beachfront Villa with Private Pool', description: 'Wake up to ocean views. Spacious villa with an infinity pool, outdoor kitchen and direct beach access.', price: 1250000, listingType: 'sale', type: 'villa', bedrooms: 5, bathrooms: 4, area: 4200, city: 'Miami', address: '5 Ocean Breeze Road', images: [img('photo-1613490493576-7fde63acd811'), img('photo-1580587771525-78b9dba3b914')], amenities: ['Private Pool', 'Beach Access', 'Smart Home', 'Home Theater'] }),
    mk(4, { title: 'Cozy Studio near University', description: 'Furnished studio, ideal for students or young professionals. Walk to campus, cafes and the metro.', price: 1150, listingType: 'rent', type: 'apartment', bedrooms: 1, bathrooms: 1, area: 480, city: 'Seattle', address: '41 College Avenue', images: [img('photo-1522708323590-d24dbb6b0267')], amenities: ['Furnished', 'Wi-Fi', 'Laundry'] }),
    mk(5, { title: 'Contemporary Townhouse', description: 'Three-level townhouse with a rooftop terrace, EV charger and a minimalist interior.', price: 640000, listingType: 'sale', type: 'house', bedrooms: 3, bathrooms: 3, area: 1900, city: 'Denver', address: '27 Aspen Court', images: [img('photo-1600585154340-be6161a56a0c'), img('photo-1564013799919-ab600027ffc6')], amenities: ['Rooftop Terrace', 'EV Charger', 'Garage'] }),
    mk(6, { title: 'Prime Commercial Office Space', description: 'Open-plan office floor in a busy business district. Meeting rooms, fibre internet and 24/7 access.', price: 7800, listingType: 'rent', type: 'commercial', bedrooms: 0, bathrooms: 2, area: 3000, city: 'San Diego', address: '300 Harbor Plaza', images: [img('photo-1497366216548-37526070297c')], amenities: ['Meeting Rooms', 'Fibre Internet', 'Parking', '24/7 Access'] }),
    mk(7, { title: 'Hilltop Residential Plot', description: 'Level, ready-to-build plot with utilities at the boundary and panoramic valley views.', price: 120000, listingType: 'sale', type: 'land', bedrooms: 0, bathrooms: 0, area: 8000, city: 'Denver', address: 'Ridge Road, Lot 9', images: [img('photo-1500382017468-9049fed747ef')], amenities: ['Water Connection', 'Road Access', 'Valley View'] }),
    mk(8, { title: 'Charming Cottage with Porch', description: 'Renovated cottage with original hardwood floors, a wraparound porch and a sunny reading nook.', price: 2100, listingType: 'rent', type: 'house', bedrooms: 2, bathrooms: 1, area: 1250, city: 'Austin', address: '9 Willow Lane', images: [img('photo-1512917774080-9991f1c4c750'), img('photo-1583608205776-bfd35f0d9f83')], amenities: ['Porch', 'Pet Friendly', 'Garden'] }),
  ];
  db.write(d);
  console.log('Seeded demo data (login: demo@estate.com / demo123)');
};
