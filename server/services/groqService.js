import 'dotenv/config';
import { query } from '../db.js';
import { HOTELS_DATA } from '../../src/data/hotelsData.js';
import { TICKETS_DATA } from '../../src/data/ticketsData.js';
import { GUIDES_DATA } from '../../src/data/guidesData.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ─────────────────────────────────────────────────────────────
// TravelEase Grounding & Context Engine
// ─────────────────────────────────────────────────────────────

async function fetchCatalogData() {
  let hotels = [];
  let tickets = [];
  let guides = [];

  try {
    const hotelRes = await Promise.race([
      query('SELECT id, name, city, country, rating, price_per_night, badge, description, amenities FROM hotels WHERE is_active = true LIMIT 30'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1500))
    ]);
    hotels = hotelRes.rows.map(h => ({
      id: h.id,
      name: h.name,
      city: h.city,
      country: h.country,
      rating: Number(h.rating),
      price: `$${h.price_per_night}/night`,
      badge: h.badge,
      amenities: Array.isArray(h.amenities) ? h.amenities.slice(0, 4).join(', ') : '',
      description: h.description
    }));
  } catch {
    hotels = HOTELS_DATA.map(h => ({
      id: h.id,
      name: h.name,
      city: h.city,
      country: h.country,
      rating: h.rating,
      price: `${h.currency}${h.pricePerNight}/night`,
      badge: h.badge,
      amenities: (h.amenities || []).slice(0, 4).join(', '),
      description: h.description
    }));
  }

  try {
    const ticketRes = await Promise.race([
      query('SELECT id, mode, mode_name, carrier, origin, destination, departure_time, duration, price, seats_available FROM tickets WHERE is_active = true LIMIT 30'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1500))
    ]);
    tickets = ticketRes.rows.map(t => ({
      id: t.id,
      mode: t.mode_name || t.mode,
      carrier: t.carrier,
      route: `${t.origin} -> ${t.destination}`,
      departure: t.departure_time,
      duration: t.duration,
      price: `$${t.price}`,
      seats: t.seats_available
    }));
  } catch {
    tickets = TICKETS_DATA.map(t => ({
      id: t.id,
      mode: t.modeName,
      carrier: t.carrier,
      route: `${t.origin} -> ${t.destination}`,
      departure: t.departureTime,
      duration: t.duration,
      price: `$${t.price}`,
      seats: t.seatsAvailable
    }));
  }

  try {
    const guideRes = await Promise.race([
      query('SELECT id, name, city, region, rating, price_per_day, specialty, languages FROM guides WHERE is_active = true LIMIT 20'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1500))
    ]);
    guides = guideRes.rows.map(g => ({
      id: g.id,
      name: g.name,
      city: g.city,
      region: g.region,
      rating: Number(g.rating),
      price: `$${g.price_per_day}/day`,
      specialty: g.specialty,
      languages: Array.isArray(g.languages) ? g.languages.join(', ') : ''
    }));
  } catch {
    guides = GUIDES_DATA.map(g => ({
      id: g.id,
      name: g.name,
      city: g.city,
      region: g.region,
      rating: g.rating,
      price: `$${g.pricePerDay}/day`,
      specialty: g.specialty,
      languages: (g.languages || []).join(', ')
    }));
  }

  return { hotels, tickets, guides };
}

export function buildSystemPrompt(catalog) {
  return `You are the "TravelEase AI Concierge", an elite, sophisticated, and deeply knowledgeable travel assistant for the TravelEase booking platform.

ABOUT TRAVELEASE:
- TravelEase is an all-in-one travel platform for booking verified hotels, transportation tickets (flights, high-speed rail, express buses), and licensed local tour guides.
- Users can view and manage confirmed bookings in "My Bookings" page.
- Cancellation Policy: 100% full refund if cancelled >= 48 hours prior to check-in/departure. 50% refund between 24-48 hours. Non-refundable within 24 hours.
- Customer Support: 24/7 support at support@travelease.com or via the Contact page.

CURRENT LIVE TRAVELEASE INVENTORY:

HOTELS:
${catalog.hotels.map(h => `- [ID: ${h.id}] "${h.name}" in ${h.city}, ${h.country} | Rating: ${h.rating}⭐ | Price: ${h.price} | Amenities: ${h.amenities} | Badge: ${h.badge || 'None'}`).join('\n')}

TRANSPORT TICKETS:
${catalog.tickets.map(t => `- [ID: ${t.id}] ${t.carrier} (${t.mode}): ${t.route} | Departs: ${t.departure} | Duration: ${t.duration} | Price: ${t.price} | Seats: ${t.seats}`).join('\n')}

CERTIFIED LOCAL GUIDES:
${catalog.guides.map(g => `- [ID: ${g.id}] ${g.name} in ${g.city} (${g.region}) | Rating: ${g.rating}⭐ | Price: ${g.price} | Languages: ${g.languages} | Specialty: ${g.specialty}`).join('\n')}

CRITICAL INSTRUCTIONS & BEHAVIOR:
1. Tone: Warm, refined, professional, inspiring, and concise.
2. Grounded Recommendations: Always recommend items from the live TravelEase inventory above when matching the user's destination, budget, or preferences.
3. Interactive Entity Action Tags:
   Whenever you mention or recommend an item from the inventory, append its special action tag at the end of the recommendation so the TravelEase UI can render an interactive booking card with a direct "View & Book" button:
   - For a hotel: [[HOTEL:id]] (e.g. [[HOTEL:h1]])
   - For a ticket: [[TICKET:id]] (e.g. [[TICKET:t1]])
   - For a guide: [[GUIDE:id]] (e.g. [[GUIDE:g1]])
4. Itineraries: When users ask for a trip plan or itinerary, organize it logically by day (Day 1, Day 2), pairing morning/afternoon activities with relevant TravelEase hotels, tickets, or guides.
5. Markdown: Use clean markdown with headings (###), bold text, bullet points, and pricing callouts.
6. Guardrails: If the user asks questions completely unrelated to travel, hotels, tickets, tours, geography, or TravelEase (e.g. general coding, math problems, politics), politely steer them back to planning their next journey with TravelEase.`;
}

// ─────────────────────────────────────────────────────────────
// Groq API Call Handlers
// ─────────────────────────────────────────────────────────────

export async function handleChatStream({ messages, onChunk, onDone, onError }) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const catalog = await fetchCatalogData();
  const systemPrompt = buildSystemPrompt(catalog);

  // Filter messages to last 10 turns to keep prompt optimal
  const cleanMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '')
    }))
  ];

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: cleanMessages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: true
      })
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `Groq API responded with status ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed === 'data: [DONE]') {
          onDone();
          return;
        }
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              onChunk(delta);
            }
          } catch {
            // Ignore malformed JSON chunks
          }
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err);
  }
}

export async function handleChatCompletion({ messages }) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const catalog = await fetchCatalogData();
  const systemPrompt = buildSystemPrompt(catalog);

  const cleanMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '')
    }))
  ];

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: cleanMessages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: false
    })
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `Groq API responded with status ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
