-- ============================================================
-- TravelEase — Neon PostgreSQL Schema
-- Run this in Neon SQL Editor or via the seed script
-- ============================================================

-- -------- USERS --------
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(50)  PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  role          VARCHAR(20)  NOT NULL DEFAULT 'traveler' CHECK (role IN ('traveler', 'guide', 'admin')),
  avatar        TEXT,
  title         VARCHAR(100),
  status        VARCHAR(20)  NOT NULL DEFAULT 'Active',
  member_since  VARCHAR(20),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -------- HOTELS --------
CREATE TABLE IF NOT EXISTS hotels (
  id              VARCHAR(50)    PRIMARY KEY,
  name            VARCHAR(255)   NOT NULL,
  location        VARCHAR(255)   NOT NULL,
  city            VARCHAR(100)   NOT NULL,
  country         VARCHAR(100)   NOT NULL,
  lat             DECIMAL(10,6),
  lng             DECIMAL(10,6),
  rating          DECIMAL(3,2)   NOT NULL DEFAULT 4.5,
  reviews_count   INTEGER        NOT NULL DEFAULT 0,
  price_per_night DECIMAL(10,2)  NOT NULL,
  currency        VARCHAR(5)     NOT NULL DEFAULT '$',
  badge           VARCHAR(100),
  image           TEXT           NOT NULL,
  gallery         TEXT[]         DEFAULT '{}',
  amenities       TEXT[]         DEFAULT '{}',
  description     TEXT,
  is_active       BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- -------- HOTEL ROOMS --------
CREATE TABLE IF NOT EXISTS hotel_rooms (
  id          VARCHAR(50)   PRIMARY KEY,
  hotel_id    VARCHAR(50)   NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name        VARCHAR(200)  NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  capacity    VARCHAR(50),
  bed         VARCHAR(100),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -------- TICKETS / TRANSPORT ROUTES --------
CREATE TABLE IF NOT EXISTS tickets (
  id              VARCHAR(50)   PRIMARY KEY,
  mode            VARCHAR(20)   NOT NULL CHECK (mode IN ('flight', 'train', 'bus')),
  mode_name       VARCHAR(50)   NOT NULL,
  carrier         VARCHAR(150)  NOT NULL,
  flight_no       VARCHAR(20),
  origin          VARCHAR(150)  NOT NULL,
  destination     VARCHAR(150)  NOT NULL,
  departure_time  VARCHAR(20)   NOT NULL,
  arrival_time    VARCHAR(20),
  duration        VARCHAR(30),
  type            VARCHAR(60),
  price           DECIMAL(10,2) NOT NULL,
  seats_available INTEGER       NOT NULL DEFAULT 0,
  baggage         TEXT,
  features        TEXT[]        DEFAULT '{}',
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -------- TICKET CLASSES --------
CREATE TABLE IF NOT EXISTS ticket_classes (
  id          SERIAL        PRIMARY KEY,
  ticket_id   VARCHAR(50)   NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  name        VARCHAR(100)  NOT NULL,
  multiplier  DECIMAL(4,2)  NOT NULL DEFAULT 1.0,
  seat_type   VARCHAR(150),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -------- GUIDES --------
CREATE TABLE IF NOT EXISTS guides (
  id               VARCHAR(50)   PRIMARY KEY,
  name             VARCHAR(150)  NOT NULL,
  region           VARCHAR(150)  NOT NULL,
  city             VARCHAR(100)  NOT NULL,
  rating           DECIMAL(4,2)  NOT NULL DEFAULT 4.9,
  reviews_count    INTEGER       NOT NULL DEFAULT 0,
  languages        TEXT[]        DEFAULT '{}',
  price_per_day    DECIMAL(10,2) NOT NULL,
  specialty        VARCHAR(255)  NOT NULL,
  experience_years INTEGER       NOT NULL DEFAULT 1,
  badge            VARCHAR(100),
  avatar           TEXT,
  bio              TEXT,
  included         TEXT[]        DEFAULT '{}',
  is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -------- BOOKINGS --------
CREATE TABLE IF NOT EXISTS bookings (
  id              VARCHAR(30)   PRIMARY KEY,
  user_id         VARCHAR(50)   REFERENCES users(id) ON DELETE SET NULL,
  type            VARCHAR(20)   NOT NULL CHECK (type IN ('hotel', 'ticket', 'guide')),
  title           VARCHAR(255)  NOT NULL,
  location        VARCHAR(255),
  image           TEXT,

  -- Hotel-specific
  dates           VARCHAR(100),
  nights          INTEGER,
  guests          VARCHAR(50),
  room            VARCHAR(150),
  hotel_id        VARCHAR(50)   REFERENCES hotels(id) ON DELETE SET NULL,

  -- Ticket-specific
  departure_time  VARCHAR(100),
  duration        VARCHAR(50),
  class_type      VARCHAR(100),
  seat_no         VARCHAR(50),
  passengers      VARCHAR(100),
  ticket_id       VARCHAR(50)   REFERENCES tickets(id) ON DELETE SET NULL,

  -- Guide-specific
  days_count      INTEGER,
  specialty       VARCHAR(255),
  guide_id        VARCHAR(50)   REFERENCES guides(id) ON DELETE SET NULL,

  -- Common
  total_amount    DECIMAL(10,2) NOT NULL DEFAULT 0,
  status          VARCHAR(20)   NOT NULL DEFAULT 'Confirmed'
                  CHECK (status IN ('Confirmed', 'Completed', 'Cancelled', 'Refunded')),
  booking_date    VARCHAR(50),
  payment_method  VARCHAR(100),

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -------- INQUIRIES / CONTACT MESSAGES --------
CREATE TABLE IF NOT EXISTS inquiries (
  id          VARCHAR(20)   PRIMARY KEY,
  name        VARCHAR(150)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  topic       VARCHAR(50)   NOT NULL DEFAULT 'general',
  message     TEXT          NOT NULL,
  status      VARCHAR(20)   NOT NULL DEFAULT 'New'
              CHECK (status IN ('New', 'In Progress', 'Resolved', 'Archived')),
  admin_notes TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -------- INDEXES --------
CREATE INDEX IF NOT EXISTS idx_hotels_city     ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_country  ON hotels(country);
CREATE INDEX IF NOT EXISTS idx_hotels_active   ON hotels(is_active);
CREATE INDEX IF NOT EXISTS idx_hotel_rooms_hotel ON hotel_rooms(hotel_id);

CREATE INDEX IF NOT EXISTS idx_tickets_mode    ON tickets(mode);
CREATE INDEX IF NOT EXISTS idx_tickets_origin  ON tickets(origin);
CREATE INDEX IF NOT EXISTS idx_tickets_dest    ON tickets(destination);
CREATE INDEX IF NOT EXISTS idx_tickets_active  ON tickets(is_active);
CREATE INDEX IF NOT EXISTS idx_ticket_classes_ticket ON ticket_classes(ticket_id);

CREATE INDEX IF NOT EXISTS idx_guides_city     ON guides(city);
CREATE INDEX IF NOT EXISTS idx_guides_active   ON guides(is_active);

CREATE INDEX IF NOT EXISTS idx_bookings_user   ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_type   ON bookings(type);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel  ON bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ticket ON bookings(ticket_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guide  ON bookings(guide_id);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email  ON inquiries(email);
