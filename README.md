# HomeNest – Real Estate Listing

Angular 17 (standalone components) + Node.js/Express + JSON-file storage.

## Run it (two terminals)

Backend — http://localhost:3000
    cd backend
    npm install
    npm start

Frontend — http://localhost:4200
    cd frontend
    npm install
    npm start

Open http://localhost:4200. Demo account: demo@estate.com / demo123
(8 sample properties are seeded into backend/data/db.json on first start.)

## Features
- Browse / search (keyword, buy-rent, type, beds, price range, sort)
- Property detail page with gallery, amenities, owner contact
- Register / login (JWT, bcrypt-hashed passwords)
- Post, edit, delete your own listings
- Favorites, My Listings
- Responsive UI

## API
POST   /api/auth/register | /api/auth/login      GET /api/auth/me
GET    /api/properties?q=&city=&type=&listingType=&minPrice=&maxPrice=&beds=&sort=
GET    /api/properties/mine | /favorites | /:id
POST   /api/properties            (auth)
PUT    /api/properties/:id        (auth, owner)
DELETE /api/properties/:id        (auth, owner)
POST   /api/properties/:id/favorite  (auth, toggles)

## Notes
- Currency: change CURRENCY in frontend/src/app/core/config.ts
- Set JWT_SECRET env var for the backend in production
- Reset data: stop the server, replace backend/data/db.json with {"users":[],"properties":[]}, restart
