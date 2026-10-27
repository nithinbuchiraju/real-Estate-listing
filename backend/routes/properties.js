const router = require('express').Router();
const { randomUUID } = require('crypto');
const db = require('../utils/db');
const { auth, optionalAuth } = require('../middleware/auth');

const favIds = (d, user) => (user ? d.users.find((u) => u.id === user.id)?.favorites || [] : []);
const withFav = (p, favs) => ({ ...p, isFavorite: favs.includes(p.id) });

function pick(b = {}) {
  const num = (v) => Number(v) || 0;
  const list = (v) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : []);
  return {
    title: String(b.title || '').trim(),
    description: String(b.description || '').trim(),
    price: num(b.price),
    listingType: b.listingType === 'rent' ? 'rent' : 'sale',
    type: ['house', 'apartment', 'villa', 'land', 'commercial'].includes(b.type) ? b.type : 'house',
    bedrooms: num(b.bedrooms),
    bathrooms: num(b.bathrooms),
    area: num(b.area),
    city: String(b.city || '').trim(),
    address: String(b.address || '').trim(),
    images: list(b.images),
    amenities: list(b.amenities),
  };
}
const validate = (p) => (!p.title || !p.city || p.price <= 0 ? 'Title, city and a valid price are required' : null);

// ---- list + search/filter/sort ----
router.get('/', optionalAuth, (req, res) => {
  const d = db.read();
  const favs = favIds(d, req.user);
  const { q, city, type, listingType, minPrice, maxPrice, beds, sort } = req.query;

  let list = d.properties.filter((p) => {
    if (q && !`${p.title} ${p.city} ${p.address} ${p.description}`.toLowerCase().includes(String(q).toLowerCase())) return false;
    if (city && !p.city.toLowerCase().includes(String(city).toLowerCase())) return false;
    if (type && p.type !== type) return false;
    if (listingType && p.listingType !== listingType) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (beds && p.bedrooms < Number(beds)) return false;
    return true;
  });

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  };
  list.sort(sorters[sort] || sorters.newest);
  res.json(list.map((p) => withFav(p, favs)));
});

// ---- must be declared before '/:id' ----
router.get('/mine', auth, (req, res) => {
  const d = db.read();
  const favs = favIds(d, req.user);
  res.json(d.properties.filter((p) => p.ownerId === req.user.id).map((p) => withFav(p, favs)));
});

router.get('/favorites', auth, (req, res) => {
  const d = db.read();
  const favs = favIds(d, req.user);
  res.json(d.properties.filter((p) => favs.includes(p.id)).map((p) => withFav(p, favs)));
});

router.get('/:id', optionalAuth, (req, res) => {
  const d = db.read();
  const p = d.properties.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ message: 'Property not found' });
  res.json(withFav(p, favIds(d, req.user)));
});

router.post('/', auth, (req, res) => {
  const data = pick(req.body);
  const err = validate(data);
  if (err) return res.status(400).json({ message: err });

  const d = db.read();
  const owner = d.users.find((u) => u.id === req.user.id);
  const property = {
    id: randomUUID(), ...data,
    ownerId: owner.id, ownerName: owner.name, ownerEmail: owner.email, ownerPhone: owner.phone,
    createdAt: new Date().toISOString(),
  };
  d.properties.push(property);
  db.write(d);
  res.status(201).json(property);
});

router.put('/:id', auth, (req, res) => {
  const d = db.read();
  const i = d.properties.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ message: 'Property not found' });
  if (d.properties[i].ownerId !== req.user.id) return res.status(403).json({ message: 'Not your listing' });

  const data = pick(req.body);
  const err = validate(data);
  if (err) return res.status(400).json({ message: err });

  d.properties[i] = { ...d.properties[i], ...data, updatedAt: new Date().toISOString() };
  db.write(d);
  res.json(d.properties[i]);
});

router.delete('/:id', auth, (req, res) => {
  const d = db.read();
  const p = d.properties.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ message: 'Property not found' });
  if (p.ownerId !== req.user.id) return res.status(403).json({ message: 'Not your listing' });

  d.properties = d.properties.filter((x) => x.id !== p.id);
  d.users.forEach((u) => (u.favorites = (u.favorites || []).filter((id) => id !== p.id)));
  db.write(d);
  res.json({ message: 'Deleted' });
});

router.post('/:id/favorite', auth, (req, res) => {
  const d = db.read();
  if (!d.properties.some((x) => x.id === req.params.id)) return res.status(404).json({ message: 'Property not found' });
  const user = d.users.find((u) => u.id === req.user.id);
  user.favorites = user.favorites || [];
  const has = user.favorites.includes(req.params.id);
  user.favorites = has ? user.favorites.filter((id) => id !== req.params.id) : [...user.favorites, req.params.id];
  db.write(d);
  res.json({ isFavorite: !has });
});

module.exports = router;
