/**
 * TravelEase — Neon DB Setup & Seed Script
 * Creates all tables and seeds them with the full dataset from the frontend data files.
 *
 * Usage:
 *   node scripts/db-setup.js
 */

import 'dotenv/config';
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const { Pool } = pg;

// ────────────────────────────────────────────────────────
// Connection — uses env var first, falls back to hardcoded
// ────────────────────────────────────────────────────────
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_K3trYvVg0Jop@ep-mute-dew-b4p193v9-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ──────────── DATA ────────────

const HOTELS = [
  {
    id: 'h1', name: 'The Azure Horizon Resort & Spa', location: 'Goa, India', city: 'Goa', country: 'India',
    lat: 15.2993, lng: 73.9842, rating: 4.9, reviews_count: 428, price_per_night: 185, currency: '$',
    badge: 'Luxury Beachfront',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: ['Private Beach', 'Infinity Pool', 'Spa & Wellness', 'Free High-Speed WiFi', 'Ocean View Restaurant', 'Airport Shuttle', 'Breakfast Included'],
    description: 'Nestled on pristine golden sands, The Azure Horizon offers panoramic Arabian Sea views, world-class Ayurvedic spa treatments, and private sunset cabanas.',
    rooms: [
      { id: 'h1-r1', name: 'Deluxe Ocean View Room', price: 185, capacity: '2 Adults', bed: '1 King Bed' },
      { id: 'h1-r2', name: 'Executive Beach Villa', price: 290, capacity: '3 Adults', bed: '1 King Bed + 1 Daybed' },
      { id: 'h1-r3', name: 'Presidential Royal Suite', price: 460, capacity: '4 Adults', bed: '2 King Beds' }
    ]
  },
  {
    id: 'h2', name: 'Hôtel Luminaire Champs-Élysées', location: 'Paris, France', city: 'Paris', country: 'France',
    lat: 48.8698, lng: 2.3075, rating: 4.8, reviews_count: 612, price_per_night: 245, currency: '$',
    badge: 'Near Eiffel Tower',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: ['Eiffel Tower View', 'Michelin Star Dining', 'Free High-Speed WiFi', 'Concierge 24/7', 'Valet Parking', 'Cocktail Lounge'],
    description: 'A quintessentially Parisian boutique hotel blending Haussmannian elegance with contemporary luxury, steps from luxury boutiques and the Seine.',
    rooms: [
      { id: 'h2-r1', name: 'Classic Parisian Suite', price: 245, capacity: '2 Adults', bed: '1 Queen Bed' },
      { id: 'h2-r2', name: 'Eiffel View Balcony Room', price: 340, capacity: '2 Adults', bed: '1 King Bed' }
    ]
  },
  {
    id: 'h3', name: 'Bamboo Rainforest Sanctuary', location: 'Ubud, Bali, Indonesia', city: 'Bali', country: 'Indonesia',
    lat: -8.5069, lng: 115.2625, rating: 4.95, reviews_count: 389, price_per_night: 135, currency: '$',
    badge: 'Eco-Lodge & Spa',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80'],
    amenities: ['Jungle Infinity Pool', 'Daily Yoga & Meditation', 'Organic Farm-to-Table', 'Free WiFi', 'Ayurvedic Spa', 'Rice Terrace Walk'],
    description: 'Immerse yourself in Bali\'s lush green canopy with open-air bamboo pavilions, soothing river sounds, and holistic wellness retreats.',
    rooms: [
      { id: 'h3-r1', name: 'Riverfront Canopy Suite', price: 135, capacity: '2 Adults', bed: '1 King Bed' },
      { id: 'h3-r2', name: 'Private Pool Bamboo Villa', price: 220, capacity: '2 Adults', bed: '1 Four-Poster King Bed' }
    ]
  },
  {
    id: 'h4', name: 'The Sakura Grand Ryokan', location: 'Kyoto, Japan', city: 'Kyoto', country: 'Japan',
    lat: 34.9949, lng: 135.7850, rating: 4.92, reviews_count: 540, price_per_night: 210, currency: '$',
    badge: 'Traditional Onsen',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80'],
    amenities: ['Natural Hot Springs (Onsen)', 'Kaiseki Multi-Course Dining', 'Zen Rock Garden', 'Tatami Mat Suites', 'Tea Ceremony'],
    description: 'Experience tranquil Japanese hospitality in historic Gion, complete with natural mineral hot spring baths and exquisite seasonal Kaiseki dining.',
    rooms: [
      { id: 'h4-r1', name: 'Traditional Tatami Suite', price: 210, capacity: '2-3 Guests', bed: 'Japanese Futon' },
      { id: 'h4-r2', name: 'Garden View Suite with Private Rotenburo', price: 360, capacity: '2 Guests', bed: 'Luxury Futon & Outdoor Bath' }
    ]
  },
  {
    id: 'h5', name: 'Matterhorn Alpine Chalet', location: 'Zermatt, Switzerland', city: 'Zermatt', country: 'Switzerland',
    lat: 45.9765, lng: 7.7491, rating: 4.88, reviews_count: 310, price_per_night: 280, currency: '$',
    badge: 'Ski-in / Ski-out',
    image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80'],
    amenities: ['Ski Storage & Rental', 'Heated Outdoor Whirlpool', 'Fireplace Lounge', 'Sauna & Steam Bath', 'Fondue Stube', 'Free WiFi'],
    description: 'Perched in the Swiss Alps facing the majestic Matterhorn, this luxury timber chalet provides direct piste access and fireside raclette.',
    rooms: [
      { id: 'h5-r1', name: 'Alpine Superior Room', price: 280, capacity: '2 Adults', bed: '1 King Bed' },
      { id: 'h5-r2', name: 'Matterhorn Panoramic Penthouse', price: 490, capacity: '4 Adults', bed: '2 King Beds + Balcony' }
    ]
  },
  {
    id: 'h6', name: 'Manhattan Skyline Penthouse Hotel', location: 'New York City, USA', city: 'New York', country: 'United States',
    lat: 40.7580, lng: -73.9855, rating: 4.76, reviews_count: 820, price_per_night: 260, currency: '$',
    badge: 'Times Square & Broadway',
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1000&q=80'],
    amenities: ['Rooftop Cocktail Lounge', '24/7 High-Tech Gym', 'Fast Fiber WiFi', 'City Views', 'Pet Friendly', 'In-Room Nespresso'],
    description: 'Positioned right in midtown Manhattan, offering floor-to-ceiling skyline vistas, signature cocktails, and direct access to Broadway.',
    rooms: [
      { id: 'h6-r1', name: 'Skyline City King', price: 260, capacity: '2 Adults', bed: '1 King Bed' },
      { id: 'h6-r2', name: 'Broadway Corner Suite', price: 395, capacity: '3 Adults', bed: '1 King Bed + Sleeper Sofa' }
    ]
  }
];

const TICKETS = [
  {
    id: 't1', mode: 'flight', mode_name: 'Flight', carrier: 'SkyLuxe Airways', flight_no: 'SL-402',
    origin: 'New York (JFK)', destination: 'London (LHR)', departure_time: '08:30 AM', arrival_time: '08:45 PM',
    duration: '7h 15m', type: 'Non-stop', price: 480, seats_available: 14,
    baggage: '1 Carry-on (10kg) + 2 Checked Bags (23kg each)',
    features: ['In-flight Wi-Fi', 'Complimentary Gourmet Meal', 'USB Power Outlet', 'On-demand Entertainment'],
    classes: [
      { name: 'Economy Classic', multiplier: 1.0, seat_type: 'Standard Recline' },
      { name: 'Premium Economy', multiplier: 1.45, seat_type: 'Extra Legroom + Priority Boarding' },
      { name: 'Business Class Lie-Flat', multiplier: 2.8, seat_type: 'Private Suite + Lounge Access' }
    ]
  },
  {
    id: 't2', mode: 'flight', mode_name: 'Flight', carrier: 'Air France', flight_no: 'AF-1184',
    origin: 'London (LHR)', destination: 'Paris (CDG)', departure_time: '11:15 AM', arrival_time: '01:35 PM',
    duration: '1h 20m', type: 'Non-stop', price: 95, seats_available: 28,
    baggage: '1 Carry-on (12kg)',
    features: ['Complimentary Snacks & French Wine', 'Fast Check-in', 'Mobile Boarding Pass'],
    classes: [
      { name: 'Standard Economy', multiplier: 1.0, seat_type: 'Standard Window/Aisle' },
      { name: 'Flexi Economy', multiplier: 1.3, seat_type: 'Front of Cabin + Free Changes' }
    ]
  },
  {
    id: 't3', mode: 'train', mode_name: 'High-Speed Rail', carrier: 'Shinkansen Nozomi', flight_no: 'SH-88',
    origin: 'Tokyo (Tokyo Station)', destination: 'Kyoto (Kyoto Station)', departure_time: '09:00 AM', arrival_time: '11:15 AM',
    duration: '2h 15m', type: 'Bullet Train Express', price: 110, seats_available: 42,
    baggage: '2 pieces standard luggage allowed',
    features: ['High-Speed 320 km/h', 'Quiet Cabin', 'Fuji Mountain View Side', 'Power Socket every seat'],
    classes: [
      { name: 'Standard Reserved', multiplier: 1.0, seat_type: 'Reserved Row Seat' },
      { name: 'Green Car (First Class)', multiplier: 1.6, seat_type: 'Plush Wide Recliner + Attendant' }
    ]
  },
  {
    id: 't4', mode: 'train', mode_name: 'High-Speed Rail', carrier: 'Eurostar Express', flight_no: 'ES-9014',
    origin: 'Paris (Gare du Nord)', destination: 'London (St Pancras)', departure_time: '02:20 PM', arrival_time: '03:40 PM',
    duration: '2h 20m', type: 'Direct Tunnel Rail', price: 125, seats_available: 19,
    baggage: '2 large bags + 1 hand luggage',
    features: ['Cross-Channel Tunnel', 'Café Bar Car', 'Free Wi-Fi', 'City-Center to City-Center'],
    classes: [
      { name: 'Standard Class', multiplier: 1.0, seat_type: 'Comfy fabric seat' },
      { name: 'Standard Premier', multiplier: 1.55, seat_type: 'Light meal served at seat + spacious desk' }
    ]
  },
  {
    id: 't5', mode: 'bus', mode_name: 'Luxury Sleeper Bus', carrier: 'Coastal Cruiser Luxury Line', flight_no: 'CC-302',
    origin: 'Mumbai (Borivali)', destination: 'Goa (Panaji)', departure_time: '07:30 PM', arrival_time: '08:00 AM',
    duration: '12h 30m', type: 'Overnight Sleeper', price: 42, seats_available: 8,
    baggage: '2 Luggage bags up to 30kg',
    features: ['Individual AC Berth', 'Personal TV Screen', 'Reading Lamp', 'Water Bottle & Blanket Provided'],
    classes: [
      { name: 'Single Lower Berth', multiplier: 1.0, seat_type: 'Private Single Bed' },
      { name: 'Double Suite Berth', multiplier: 1.75, seat_type: 'Couples Spacious Bed' }
    ]
  },
  {
    id: 't6', mode: 'flight', mode_name: 'Flight', carrier: 'Garuda Indonesia', flight_no: 'GA-408',
    origin: 'Singapore (SIN)', destination: 'Bali (DPS)', departure_time: '01:45 PM', arrival_time: '04:35 PM',
    duration: '2h 50m', type: 'Non-stop', price: 140, seats_available: 12,
    baggage: '1 Carry-on + 1 Checked bag (20kg)',
    features: ['Tropical Refreshments', 'Extra Legroom', 'Priority Baggage'],
    classes: [
      { name: 'Economy Special', multiplier: 1.0, seat_type: 'Standard' },
      { name: 'Business Comfort', multiplier: 2.1, seat_type: 'Wide Recliner' }
    ]
  }
];

const GUIDES = [
  {
    id: 'g1', name: 'Rohan Deshmukh', region: 'Goa, India', city: 'Goa',
    rating: 4.96, reviews_count: 184, languages: ['English', 'Hindi', 'Konkani', 'Portuguese'],
    price_per_day: 65, specialty: 'Heritage Forts, Hidden Beaches & Goan Cuisine', experience_years: 8,
    badge: 'Top Rated Expert',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Born and raised in Old Goa, Rohan specializes in Latin Quarter heritage walks, spice plantation culinary tours, and sunset kayaking along secret backwaters.',
    included: ['Custom itinerary planning', 'Local transportation arrangements', 'Heritage entrance shortcuts', 'Food tasting recommendations']
  },
  {
    id: 'g2', name: 'Amélie Laurent', region: 'Paris, France', city: 'Paris',
    rating: 4.98, reviews_count: 310, languages: ['French', 'English', 'Spanish'],
    price_per_day: 120, specialty: 'Art History, Louvre & Hidden Montmartre', experience_years: 11,
    badge: 'Certified Art Historian',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Sorbonne art history graduate and licensed national guide. Amélie reveals the secrets of Montmartre, masterworks in the Musée d\'Orsay, and the best artisanal patisseries in Le Marais.',
    included: ['Priority museum access coordination', 'Personalized historic storytelling', 'Bespoke wine and cheese pairing stops']
  },
  {
    id: 'g3', name: 'Kenji Takahashi', region: 'Kyoto, Japan', city: 'Kyoto',
    rating: 4.95, reviews_count: 245, languages: ['Japanese', 'English'],
    price_per_day: 110, specialty: 'Zen Temples, Tea Ceremonies & Bamboo Forest', experience_years: 9,
    badge: 'Cultural Master',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Kenji guides travelers through centuries-old Shinto shrines, secluded moss gardens, traditional Gion geisha districts, and authentic private matcha tea ceremonies.',
    included: ['Private Zen garden access', 'Kimono dressing advice', 'Etiquette and cultural masterclass']
  },
  {
    id: 'g4', name: 'Wayan Sudarma', region: 'Bali, Indonesia', city: 'Bali',
    rating: 4.91, reviews_count: 198, languages: ['English', 'Indonesian', 'Balinese'],
    price_per_day: 55, specialty: 'Waterfalls, Volcano Sunrise Trekking & Temples', experience_years: 7,
    badge: 'Adventure Specialist',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bio: 'Wayan leads exhilarating sunrise treks up Mount Batur, spiritual cleansing rituals at Tirta Empul, and hidden jungle waterfall explorations away from crowds.',
    included: ['Safe trekking equipment & headlamps', 'Spiritual temple sarong provided', 'Local fruit and Balinese coffee tasting']
  },
  {
    id: 'g5', name: 'Marcus Vance', region: 'New York City, USA', city: 'New York',
    rating: 4.88, reviews_count: 162, languages: ['English', 'German'],
    price_per_day: 95, specialty: 'Architecture, Street Art & Speakeasies', experience_years: 6,
    badge: 'Urban Explorer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bio: 'Native New Yorker Marcus guides you through secret underground speakeasies, High Line architecture, Greenwich Village jazz clubs, and vibrant Brooklyn graffiti culture.',
    included: ['Curated insider map', 'Historic architecture commentary', 'Speakeasy reservations access']
  }
];

const USERS = [
  {
    id: 'usr-1', name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'traveler', status: 'Active',
    member_since: 'Jan 2024',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr-2', name: 'Elena Rostova', email: 'elena.rostova@globetrek.io', role: 'traveler', status: 'Active',
    member_since: 'Mar 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr-3', name: 'Rohan Deshmukh', email: 'rohan.deshmukh@goaguides.in', role: 'guide', status: 'Active',
    member_since: 'Feb 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'usr-4', name: 'Marcus Vance', email: 'admin@travelease.com', role: 'admin', status: 'Active',
    member_since: 'Nov 2023', title: 'Platform Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  }
];

const INQUIRIES = [
  {
    id: 'INQ-101', name: 'Sophia Chen', email: 'sophia.chen@example.com', topic: 'booking',
    message: 'Hello, I would like to inquire if the Azure Horizon Resort allows late checkout on Oct 18th for our anniversary trip?',
    status: 'New'
  },
  {
    id: 'INQ-102', name: "Liam O'Connor", email: 'liam.oc@travelclub.co.uk', topic: 'partnership',
    message: 'We operate bespoke walking tours in Edinburgh and would like to register 4 licensed local guides onto the TravelEase platform.',
    status: 'In Progress'
  },
  {
    id: 'INQ-103', name: 'Dr. Maria Santos', email: 'msantos@healthres.org', topic: 'support',
    message: 'Can I add extra luggage allowance to my SkyLuxe London to Paris flight after booking confirmation?',
    status: 'Resolved'
  }
];

const BOOKINGS = [
  {
    id: 'TE-H94821', user_id: 'usr-1', type: 'hotel',
    title: 'The Azure Horizon Resort & Spa', location: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    dates: 'Oct 14, 2026 - Oct 18, 2026', nights: 4, guests: '2 Adults',
    room: 'Deluxe Ocean View Room', hotel_id: 'h1',
    total_amount: 740, status: 'Confirmed', booking_date: 'Sep 12, 2026',
    payment_method: 'Credit Card (**** 4242)'
  },
  {
    id: 'TE-T10394', user_id: 'usr-1', type: 'ticket',
    title: 'Shinkansen Nozomi (High-Speed Rail)', location: 'Tokyo → Kyoto',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    departure_time: '09:00 AM (Nov 04, 2026)', duration: '2h 15m',
    class_type: 'Green Car (First Class)', seat_no: 'Car 08, Seat 12A', ticket_id: 't3',
    total_amount: 176, status: 'Confirmed', booking_date: 'Sep 15, 2026',
    payment_method: 'Apple Pay'
  }
];

// ──────────── HELPERS ────────────

async function runSchema(client) {
  const schema = readFileSync(
    resolve(process.cwd(), 'schema.sql'),
    'utf8'
  );
  console.log('📋  Creating tables from schema.sql...');
  await client.query(schema);
  console.log('✅  Schema applied.');
}

async function seedHotels(client) {
  console.log('\n🏨  Seeding hotels...');
  for (const hotel of HOTELS) {
    await client.query(
      `INSERT INTO hotels
         (id, name, location, city, country, lat, lng, rating, reviews_count, price_per_night,
          currency, badge, image, gallery, amenities, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (id) DO UPDATE SET
         name=EXCLUDED.name, price_per_night=EXCLUDED.price_per_night,
         rating=EXCLUDED.rating, updated_at=NOW()`,
      [
        hotel.id, hotel.name, hotel.location, hotel.city, hotel.country,
        hotel.lat, hotel.lng, hotel.rating, hotel.reviews_count, hotel.price_per_night,
        hotel.currency, hotel.badge, hotel.image, hotel.gallery, hotel.amenities, hotel.description
      ]
    );
    for (const room of hotel.rooms) {
      await client.query(
        `INSERT INTO hotel_rooms (id, hotel_id, name, price, capacity, bed)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO UPDATE SET price=EXCLUDED.price`,
        [room.id, hotel.id, room.name, room.price, room.capacity, room.bed]
      );
    }
    console.log(`  → ${hotel.name}`);
  }
}

async function seedTickets(client) {
  console.log('\n🎫  Seeding tickets...');
  for (const ticket of TICKETS) {
    await client.query(
      `INSERT INTO tickets
         (id, mode, mode_name, carrier, flight_no, origin, destination,
          departure_time, arrival_time, duration, type, price, seats_available, baggage, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (id) DO UPDATE SET
         price=EXCLUDED.price, seats_available=EXCLUDED.seats_available, updated_at=NOW()`,
      [
        ticket.id, ticket.mode, ticket.mode_name, ticket.carrier, ticket.flight_no,
        ticket.origin, ticket.destination, ticket.departure_time, ticket.arrival_time,
        ticket.duration, ticket.type, ticket.price, ticket.seats_available,
        ticket.baggage, ticket.features
      ]
    );
    for (const cls of ticket.classes) {
      await client.query(
        `INSERT INTO ticket_classes (ticket_id, name, multiplier, seat_type)
         VALUES ($1,$2,$3,$4)`,
        [ticket.id, cls.name, cls.multiplier, cls.seat_type]
      );
    }
    console.log(`  → ${ticket.carrier} (${ticket.origin} → ${ticket.destination})`);
  }
}

async function seedGuides(client) {
  console.log('\n🧭  Seeding guides...');
  for (const guide of GUIDES) {
    await client.query(
      `INSERT INTO guides
         (id, name, region, city, rating, reviews_count, languages, price_per_day,
          specialty, experience_years, badge, avatar, bio, included)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         price_per_day=EXCLUDED.price_per_day, rating=EXCLUDED.rating, updated_at=NOW()`,
      [
        guide.id, guide.name, guide.region, guide.city, guide.rating, guide.reviews_count,
        guide.languages, guide.price_per_day, guide.specialty, guide.experience_years,
        guide.badge, guide.avatar, guide.bio, guide.included
      ]
    );
    console.log(`  → ${guide.name} (${guide.region})`);
  }
}

async function seedUsers(client) {
  console.log('\n👤  Seeding users...');
  for (const user of USERS) {
    await client.query(
      `INSERT INTO users (id, name, email, role, status, member_since, avatar, title)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET role=EXCLUDED.role`,
      [user.id, user.name, user.email, user.role, user.status, user.member_since, user.avatar, user.title || null]
    );
    console.log(`  → ${user.name} (${user.role})`);
  }
}

async function seedBookings(client) {
  console.log('\n📑  Seeding bookings...');
  for (const b of BOOKINGS) {
    await client.query(
      `INSERT INTO bookings
         (id, user_id, type, title, location, image,
          dates, nights, guests, room, hotel_id,
          departure_time, duration, class_type, seat_no, ticket_id,
          total_amount, status, booking_date, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status`,
      [
        b.id, b.user_id, b.type, b.title, b.location, b.image,
        b.dates || null, b.nights || null, b.guests || null, b.room || null, b.hotel_id || null,
        b.departure_time || null, b.duration || null, b.class_type || null, b.seat_no || null, b.ticket_id || null,
        b.total_amount, b.status, b.booking_date, b.payment_method
      ]
    );
    console.log(`  → ${b.id} · ${b.title}`);
  }
}

async function seedInquiries(client) {
  console.log('\n📩  Seeding inquiries...');
  for (const inq of INQUIRIES) {
    await client.query(
      `INSERT INTO inquiries (id, name, email, topic, message, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status`,
      [inq.id, inq.name, inq.email, inq.topic, inq.message, inq.status]
    );
    console.log(`  → ${inq.id} from ${inq.name}`);
  }
}

// ──────────── MAIN ────────────

async function main() {
  const client = await pool.connect();
  try {
    console.log('\n🔌  Connected to Neon PostgreSQL!\n');
    await client.query('BEGIN');

    await runSchema(client);
    // Clear ticket_classes before re-seeding (no ON CONFLICT since no unique key)
    await client.query('DELETE FROM ticket_classes');
    await seedHotels(client);
    await seedTickets(client);
    await seedGuides(client);
    await seedUsers(client);
    await seedBookings(client);
    await seedInquiries(client);

    await client.query('COMMIT');

    // Print summary
    const { rows: [counts] } = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM hotels)   AS hotels,
        (SELECT COUNT(*) FROM hotel_rooms) AS rooms,
        (SELECT COUNT(*) FROM tickets)  AS tickets,
        (SELECT COUNT(*) FROM ticket_classes) AS classes,
        (SELECT COUNT(*) FROM guides)   AS guides,
        (SELECT COUNT(*) FROM users)    AS users,
        (SELECT COUNT(*) FROM bookings) AS bookings,
        (SELECT COUNT(*) FROM inquiries) AS inquiries
    `);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   TravelEase — Neon DB Setup Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  🏨  Hotels:           ${counts.hotels}`);
    console.log(`  🛏️   Hotel Rooms:      ${counts.rooms}`);
    console.log(`  🎫  Tickets:          ${counts.tickets}`);
    console.log(`  💺  Ticket Classes:   ${counts.classes}`);
    console.log(`  🧭  Guides:           ${counts.guides}`);
    console.log(`  👤  Users:            ${counts.users}`);
    console.log(`  📑  Bookings:         ${counts.bookings}`);
    console.log(`  📩  Inquiries:        ${counts.inquiries}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌  Setup failed — rolled back.\n', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
