import express from 'express';
import cors from 'cors';
import { pool, query, checkConnection } from './_db.js';
import { handleChatStream, handleChatCompletion } from '../server/services/groqService.js';

const app = express();

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// Health & Diagnostics
// ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const dbHealth = await checkConnection();
  res.json({
    status: dbHealth.connected ? 'healthy' : 'degraded',
    database: {
      provider: 'Neon PostgreSQL',
      ...dbHealth
    },
    serverTime: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/stats', async (req, res) => {
  try {
    const { rows: [counts] } = await query(`
      SELECT
        (SELECT COUNT(*) FROM hotels WHERE is_active = true)   AS hotels,
        (SELECT COUNT(*) FROM tickets WHERE is_active = true)  AS tickets,
        (SELECT COUNT(*) FROM guides WHERE is_active = true)   AS guides,
        (SELECT COUNT(*) FROM bookings)                        AS bookings,
        (SELECT COUNT(*) FROM users)                           AS users,
        (SELECT COUNT(*) FROM inquiries)                       AS inquiries,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE status != 'Cancelled') AS total_revenue
    `);

    res.json({
      hotels: parseInt(counts.hotels, 10),
      tickets: parseInt(counts.tickets, 10),
      guides: parseInt(counts.guides, 10),
      bookings: parseInt(counts.bookings, 10),
      users: parseInt(counts.users, 10),
      inquiries: parseInt(counts.inquiries, 10),
      totalRevenue: parseFloat(counts.total_revenue)
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch platform statistics', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// HOTELS API
// ─────────────────────────────────────────────────────────────
function formatHotel(h, rooms = []) {
  return {
    id: h.id,
    name: h.name,
    location: h.location,
    city: h.city,
    country: h.country,
    lat: h.lat ? parseFloat(h.lat) : 0,
    lng: h.lng ? parseFloat(h.lng) : 0,
    rating: h.rating ? parseFloat(h.rating) : 4.5,
    reviewsCount: h.reviews_count || 0,
    pricePerNight: h.price_per_night ? parseFloat(h.price_per_night) : 0,
    currency: h.currency || '$',
    badge: h.badge,
    image: h.image,
    gallery: h.gallery || [h.image],
    amenities: h.amenities || [],
    description: h.description,
    isActive: h.is_active,
    rooms: rooms.map(r => ({
      id: r.id,
      name: r.name,
      price: parseFloat(r.price),
      capacity: r.capacity,
      bed: r.bed
    }))
  };
}

app.get('/api/hotels', async (req, res) => {
  try {
    const hotelsRes = await query(`
      SELECT * FROM hotels 
      WHERE is_active = true 
      ORDER BY rating DESC, created_at DESC
    `);
    const roomsRes = await query(`SELECT * FROM hotel_rooms`);

    const roomsByHotel = {};
    roomsRes.rows.forEach(r => {
      if (!roomsByHotel[r.hotel_id]) roomsByHotel[r.hotel_id] = [];
      roomsByHotel[r.hotel_id].push(r);
    });

    const formatted = hotelsRes.rows.map(h => formatHotel(h, roomsByHotel[h.id] || []));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: 'Failed to fetch hotels from Neon DB' });
  }
});

app.get('/api/hotels/:id', async (req, res) => {
  try {
    const hotelRes = await query(`SELECT * FROM hotels WHERE id = $1`, [req.params.id]);
    if (hotelRes.rows.length === 0) return res.status(404).json({ error: 'Hotel not found' });
    
    const roomsRes = await query(`SELECT * FROM hotel_rooms WHERE hotel_id = $1`, [req.params.id]);
    res.json(formatHotel(hotelRes.rows[0], roomsRes.rows));
  } catch (err) {
    console.error('Error fetching hotel:', err);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

app.post('/api/hotels', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const h = req.body;
    const id = h.id || `h-${Date.now()}`;
    const gallery = Array.isArray(h.gallery) && h.gallery.length ? h.gallery : [h.image];
    const amenities = Array.isArray(h.amenities)
      ? h.amenities
      : (typeof h.amenities === 'string' ? h.amenities.split(',').map(s => s.trim()).filter(Boolean) : []);

    const insertHotel = await client.query(`
      INSERT INTO hotels (id, name, location, city, country, lat, lng, rating, reviews_count, price_per_night, currency, badge, image, gallery, amenities, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      id,
      h.name,
      h.location || `${h.city || ''}, ${h.country || ''}`,
      h.city || 'Unknown',
      h.country || 'Unknown',
      h.lat || 0,
      h.lng || 0,
      h.rating || 4.8,
      h.reviewsCount || 1,
      h.pricePerNight || 150,
      h.currency || '$',
      h.badge || 'Featured',
      h.image,
      gallery,
      amenities,
      h.description || ''
    ]);

    const rooms = h.rooms && h.rooms.length ? h.rooms : [
      { id: `${id}-r1`, name: 'Deluxe Room', price: h.pricePerNight || 150, capacity: '2 Adults', bed: '1 King Bed' }
    ];

    for (const r of rooms) {
      await client.query(`
        INSERT INTO hotel_rooms (id, hotel_id, name, price, capacity, bed)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [r.id || `r-${Date.now()}-${Math.random()}`, id, r.name, r.price, r.capacity, r.bed]);
    }

    await client.query('COMMIT');
    res.status(201).json(formatHotel(insertHotel.rows[0], rooms));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating hotel:', err);
    res.status(500).json({ error: 'Failed to create hotel in Neon DB', details: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/hotels/:id', async (req, res) => {
  try {
    const h = req.body;
    const { id } = req.params;

    const fields = [];
    const values = [];
    let idx = 1;

    if (h.name !== undefined) { fields.push(`name = $${idx++}`); values.push(h.name); }
    if (h.location !== undefined) { fields.push(`location = $${idx++}`); values.push(h.location); }
    if (h.city !== undefined) { fields.push(`city = $${idx++}`); values.push(h.city); }
    if (h.country !== undefined) { fields.push(`country = $${idx++}`); values.push(h.country); }
    if (h.pricePerNight !== undefined) { fields.push(`price_per_night = $${idx++}`); values.push(h.pricePerNight); }
    if (h.rating !== undefined) { fields.push(`rating = $${idx++}`); values.push(h.rating); }
    if (h.badge !== undefined) { fields.push(`badge = $${idx++}`); values.push(h.badge); }
    if (h.image !== undefined) { fields.push(`image = $${idx++}`); values.push(h.image); }
    if (h.description !== undefined) { fields.push(`description = $${idx++}`); values.push(h.description); }
    if (h.amenities !== undefined) {
      const arr = Array.isArray(h.amenities) ? h.amenities : h.amenities.split(',').map(s => s.trim()).filter(Boolean);
      fields.push(`amenities = $${idx++}`); values.push(arr);
    }
    fields.push(`updated_at = NOW()`);

    if (fields.length === 1) return res.status(400).json({ error: 'No fields provided to update' });

    values.push(id);
    const sql = `UPDATE hotels SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const updated = await query(sql, values);

    if (updated.rows.length === 0) return res.status(404).json({ error: 'Hotel not found' });
    const roomsRes = await query(`SELECT * FROM hotel_rooms WHERE hotel_id = $1`, [id]);
    res.json(formatHotel(updated.rows[0], roomsRes.rows));
  } catch (err) {
    console.error('Error updating hotel:', err);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
});

app.delete('/api/hotels/:id', async (req, res) => {
  try {
    await query(`DELETE FROM hotels WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (err) {
    console.error('Error deleting hotel:', err);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

// ─────────────────────────────────────────────────────────────
// TICKETS API
// ─────────────────────────────────────────────────────────────
function formatTicket(t, classes = []) {
  return {
    id: t.id,
    mode: t.mode,
    modeName: t.mode_name,
    carrier: t.carrier,
    flightNo: t.flight_no,
    origin: t.origin,
    destination: t.destination,
    departureTime: t.departure_time,
    arrivalTime: t.arrival_time,
    duration: t.duration,
    type: t.type,
    price: parseFloat(t.price),
    seatsAvailable: t.seats_available,
    baggage: t.baggage,
    features: t.features || [],
    isActive: t.is_active,
    classes: classes.map(c => ({
      name: c.name,
      multiplier: parseFloat(c.multiplier),
      seatType: c.seat_type
    }))
  };
}

app.get('/api/tickets', async (req, res) => {
  try {
    const ticketsRes = await query(`SELECT * FROM tickets WHERE is_active = true ORDER BY price ASC`);
    const classesRes = await query(`SELECT * FROM ticket_classes`);

    const classesByTicket = {};
    classesRes.rows.forEach(c => {
      if (!classesByTicket[c.ticket_id]) classesByTicket[c.ticket_id] = [];
      classesByTicket[c.ticket_id].push(c);
    });

    const formatted = ticketsRes.rows.map(t => formatTicket(t, classesByTicket[t.id] || []));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.get('/api/tickets/:id', async (req, res) => {
  try {
    const ticketRes = await query(`SELECT * FROM tickets WHERE id = $1`, [req.params.id]);
    if (ticketRes.rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    const classesRes = await query(`SELECT * FROM ticket_classes WHERE ticket_id = $1`, [req.params.id]);
    res.json(formatTicket(ticketRes.rows[0], classesRes.rows));
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

app.post('/api/tickets', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const t = req.body;
    const id = t.id || `t-${Date.now()}`;
    const features = Array.isArray(t.features) ? t.features : [];

    const insertTicket = await client.query(`
      INSERT INTO tickets (id, mode, mode_name, carrier, flight_no, origin, destination, departure_time, arrival_time, duration, type, price, seats_available, baggage, features)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      id,
      t.mode || 'flight',
      t.modeName || 'Flight',
      t.carrier,
      t.flightNo || '',
      t.origin,
      t.destination,
      t.departureTime,
      t.arrivalTime || '',
      t.duration || '2h',
      t.type || 'Direct',
      t.price,
      t.seatsAvailable || 20,
      t.baggage || '1x 23kg Checked Bag',
      features
    ]);

    const classes = t.classes && t.classes.length ? t.classes : [
      { name: 'Standard / Economy', multiplier: 1.0, seatType: 'Standard Seat' },
      { name: 'First / Business', multiplier: 1.8, seatType: 'Extra Legroom' }
    ];

    for (const c of classes) {
      await client.query(`
        INSERT INTO ticket_classes (ticket_id, name, multiplier, seat_type)
        VALUES ($1, $2, $3, $4)
      `, [id, c.name, c.multiplier, c.seatType]);
    }

    await client.query('COMMIT');
    res.status(201).json(formatTicket(insertTicket.rows[0], classes));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: 'Failed to create ticket' });
  } finally {
    client.release();
  }
});

app.put('/api/tickets/:id', async (req, res) => {
  try {
    const t = req.body;
    const { id } = req.params;

    const fields = [];
    const values = [];
    let idx = 1;

    if (t.carrier !== undefined) { fields.push(`carrier = $${idx++}`); values.push(t.carrier); }
    if (t.price !== undefined) { fields.push(`price = $${idx++}`); values.push(t.price); }
    if (t.origin !== undefined) { fields.push(`origin = $${idx++}`); values.push(t.origin); }
    if (t.destination !== undefined) { fields.push(`destination = $${idx++}`); values.push(t.destination); }
    if (t.departureTime !== undefined) { fields.push(`departure_time = $${idx++}`); values.push(t.departureTime); }
    if (t.seatsAvailable !== undefined) { fields.push(`seats_available = $${idx++}`); values.push(t.seatsAvailable); }
    fields.push(`updated_at = NOW()`);

    values.push(id);
    const sql = `UPDATE tickets SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const updated = await query(sql, values);

    if (updated.rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    const classesRes = await query(`SELECT * FROM ticket_classes WHERE ticket_id = $1`, [id]);
    res.json(formatTicket(updated.rows[0], classesRes.rows));
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

app.delete('/api/tickets/:id', async (req, res) => {
  try {
    await query(`DELETE FROM tickets WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('Error deleting ticket:', err);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// ─────────────────────────────────────────────────────────────
// GUIDES API
// ─────────────────────────────────────────────────────────────
function formatGuide(g) {
  return {
    id: g.id,
    name: g.name,
    region: g.region,
    city: g.city,
    rating: g.rating ? parseFloat(g.rating) : 4.9,
    reviewsCount: g.reviews_count || 0,
    languages: g.languages || [],
    pricePerDay: g.price_per_day ? parseFloat(g.price_per_day) : 0,
    specialty: g.specialty,
    experienceYears: g.experience_years || 1,
    badge: g.badge,
    avatar: g.avatar,
    bio: g.bio,
    included: g.included || [],
    isActive: g.is_active
  };
}

app.get('/api/guides', async (req, res) => {
  try {
    const guidesRes = await query(`SELECT * FROM guides WHERE is_active = true ORDER BY rating DESC`);
    res.json(guidesRes.rows.map(formatGuide));
  } catch (err) {
    console.error('Error fetching guides:', err);
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
});

app.get('/api/guides/:id', async (req, res) => {
  try {
    const guideRes = await query(`SELECT * FROM guides WHERE id = $1`, [req.params.id]);
    if (guideRes.rows.length === 0) return res.status(404).json({ error: 'Guide not found' });
    res.json(formatGuide(guideRes.rows[0]));
  } catch (err) {
    console.error('Error fetching guide:', err);
    res.status(500).json({ error: 'Failed to fetch guide' });
  }
});

app.post('/api/guides', async (req, res) => {
  try {
    const g = req.body;
    const id = g.id || `g-${Date.now()}`;
    const languages = Array.isArray(g.languages) ? g.languages : (g.languages || 'English').split(',').map(s => s.trim()).filter(Boolean);
    const included = Array.isArray(g.included) ? g.included : (g.included || '').split(',').map(s => s.trim()).filter(Boolean);

    const inserted = await query(`
      INSERT INTO guides (id, name, region, city, rating, reviews_count, languages, price_per_day, specialty, experience_years, badge, avatar, bio, included)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      id,
      g.name,
      g.region || g.city,
      g.city,
      g.rating || 4.9,
      g.reviewsCount || 1,
      languages,
      g.pricePerDay || 100,
      g.specialty || 'General Travel & History',
      g.experienceYears || 2,
      g.badge || 'Verified Local',
      g.avatar,
      g.bio || '',
      included
    ]);

    res.status(201).json(formatGuide(inserted.rows[0]));
  } catch (err) {
    console.error('Error creating guide:', err);
    res.status(500).json({ error: 'Failed to create guide' });
  }
});

app.put('/api/guides/:id', async (req, res) => {
  try {
    const g = req.body;
    const { id } = req.params;

    const fields = [];
    const values = [];
    let idx = 1;

    if (g.name !== undefined) { fields.push(`name = $${idx++}`); values.push(g.name); }
    if (g.region !== undefined) { fields.push(`region = $${idx++}`); values.push(g.region); }
    if (g.city !== undefined) { fields.push(`city = $${idx++}`); values.push(g.city); }
    if (g.pricePerDay !== undefined) { fields.push(`price_per_day = $${idx++}`); values.push(g.pricePerDay); }
    if (g.specialty !== undefined) { fields.push(`specialty = $${idx++}`); values.push(g.specialty); }
    if (g.bio !== undefined) { fields.push(`bio = $${idx++}`); values.push(g.bio); }
    if (g.avatar !== undefined) { fields.push(`avatar = $${idx++}`); values.push(g.avatar); }
    fields.push(`updated_at = NOW()`);

    values.push(id);
    const sql = `UPDATE guides SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const updated = await query(sql, values);

    if (updated.rows.length === 0) return res.status(404).json({ error: 'Guide not found' });
    res.json(formatGuide(updated.rows[0]));
  } catch (err) {
    console.error('Error updating guide:', err);
    res.status(500).json({ error: 'Failed to update guide' });
  }
});

app.delete('/api/guides/:id', async (req, res) => {
  try {
    await query(`DELETE FROM guides WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Guide deleted successfully' });
  } catch (err) {
    console.error('Error deleting guide:', err);
    res.status(500).json({ error: 'Failed to delete guide' });
  }
});

// ─────────────────────────────────────────────────────────────
// BOOKINGS API
// ─────────────────────────────────────────────────────────────
function formatBooking(b) {
  return {
    id: b.id,
    userId: b.user_id,
    type: b.type,
    title: b.title,
    location: b.location,
    image: b.image,
    dates: b.dates,
    nights: b.nights,
    guests: b.guests,
    room: b.room,
    hotelId: b.hotel_id,
    departureTime: b.departure_time,
    duration: b.duration,
    classType: b.class_type,
    seatNo: b.seat_no,
    passengers: b.passengers,
    ticketId: b.ticket_id,
    daysCount: b.days_count,
    specialty: b.specialty,
    guideId: b.guide_id,
    totalAmount: parseFloat(b.total_amount),
    status: b.status,
    bookingDate: b.booking_date,
    paymentMethod: b.payment_method,
    createdAt: b.created_at
  };
}

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM bookings ORDER BY created_at DESC`);
    res.json(result.rows.map(formatBooking));
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `TE-${Date.now().toString().slice(-6)}`;

    const result = await query(`
      INSERT INTO bookings (
        id, user_id, type, title, location, image,
        dates, nights, guests, room, hotel_id,
        departure_time, duration, class_type, seat_no, passengers, ticket_id,
        days_count, specialty, guide_id,
        total_amount, status, booking_date, payment_method
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
      RETURNING *
    `, [
      id,
      b.userId || 'usr-1',
      b.type,
      b.title,
      b.location,
      b.image,
      b.dates || null,
      b.nights || null,
      b.guests || null,
      b.room || null,
      b.hotelId || null,
      b.departureTime || null,
      b.duration || null,
      b.classType || null,
      b.seatNo || null,
      b.passengers || null,
      b.ticketId || null,
      b.daysCount || null,
      b.specialty || null,
      b.guideId || null,
      b.totalAmount || 0,
      b.status || 'Confirmed',
      b.bookingDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      b.paymentMethod || 'Credit Card (**** 4242)'
    ]);

    res.status(201).json(formatBooking(result.rows[0]));
  } catch (err) {
    console.error('Error creating booking in Neon DB:', err);
    res.status(500).json({ error: 'Failed to save booking', details: err.message });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await query(`
      UPDATE bookings 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `, [status, req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(formatBooking(result.rows[0]));
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await query(`DELETE FROM bookings WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// ─────────────────────────────────────────────────────────────
// INQUIRIES / CONTACT API
// ─────────────────────────────────────────────────────────────
app.get('/api/inquiries', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM inquiries ORDER BY created_at DESC`);
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      topic: row.topic,
      message: row.message,
      status: row.status,
      date: new Date(row.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      adminNotes: row.admin_notes
    })));
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;
    const id = `INQ-${Math.floor(100 + Math.random() * 900)}`;

    const result = await query(`
      INSERT INTO inquiries (id, name, email, topic, message, status)
      VALUES ($1, $2, $3, $4, $5, 'New')
      RETURNING *
    `, [id, name, email, topic || 'general', message]);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our concierge team will reach out within 2 hours.',
      inquiry: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        topic: result.rows[0].topic,
        message: result.rows[0].message,
        status: result.rows[0].status,
        date: new Date(result.rows[0].created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      }
    });
  } catch (err) {
    console.error('Error saving contact inquiry:', err);
    res.status(500).json({ error: 'Failed to submit message', details: err.message });
  }
});

app.patch('/api/inquiries/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await query(`
      UPDATE inquiries 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `, [status, req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating inquiry:', err);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    await query(`DELETE FROM inquiries WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// ─────────────────────────────────────────────────────────────
// USERS API
// ─────────────────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM users ORDER BY created_at ASC`);
    res.json(result.rows.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      joined: u.member_since || '2024',
      avatar: u.avatar,
      totalBookings: 0
    })));
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const u = req.body;
    const id = u.id || `usr-${Date.now()}`;
    const result = await query(`
      INSERT INTO users (id, name, email, role, status, avatar, member_since)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role
      RETURNING *
    `, [
      id,
      u.name,
      u.email,
      u.role || 'traveler',
      u.status || 'Active',
      u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      u.joined || '2026'
    ]);

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
      joined: row.member_since,
      avatar: row.avatar,
      totalBookings: 0
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.patch('/api/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const result = await query(`
      UPDATE users 
      SET role = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `, [role, req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ─────────────────────────────────────────────────────────────
// CHATBOT API (GROQ POWERED CONCIERGE)
// ─────────────────────────────────────────────────────────────
app.get('/api/chat/suggestions', (req, res) => {
  res.json({
    suggestions: [
      { label: 'Romantic hotel in Paris', query: 'Can you recommend a romantic hotel in Paris with Eiffel Tower views?' },
      { label: 'Beach resort in Goa', query: 'What is the best beachfront resort in Goa with wellness spa?' },
      { label: 'Tokyo to Kyoto Bullet Train', query: 'How do I take the Shinkansen bullet train from Tokyo to Kyoto?' },
      { label: 'Certified guide in Kyoto', query: 'I need an English-speaking guide for historic temples in Kyoto.' },
      { label: 'Cancellation Policy', query: 'What is your refund policy if I need to cancel my booking?' }
    ]
  });
});

app.post('/api/chat', async (req, res) => {
  const { messages, stream = true } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    try {
      await handleChatStream({
        messages,
        onChunk: (chunk) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
        onDone: () => {
          res.write('data: [DONE]\n\n');
          res.end();
        },
        onError: (err) => {
          console.error('[Chatbot Stream Error]:', err.message);
          res.write(`data: ${JSON.stringify({ error: err.message || 'Stream processing failed' })}\n\n`);
          res.end();
        }
      });
    } catch (err) {
      console.error('[Chatbot Route Error]:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to process chat message', details: err.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
  } else {
    try {
      const content = await handleChatCompletion({ messages });
      res.json({ message: { role: 'assistant', content } });
    } catch (err) {
      console.error('[Chatbot Completion Error]:', err);
      res.status(500).json({ error: 'Failed to generate response', details: err.message });
    }
  }
});

// Export for Vercel Serverless
export default app;
