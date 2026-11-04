# TravelEase — System Workflow

## 2.1 Login / Registration Flow

```mermaid
sequenceDiagram
    participant U as User (React)
    participant F as Flask API
    participant DB as PostgreSQL

    U->>F: POST /auth/register (name, email, password)
    F->>F: Validate + hash password (bcrypt)
    F->>DB: Insert user
    DB-->>F: user created
    F-->>U: 201 Created

    U->>F: POST /auth/login (email, password)
    F->>DB: Fetch user by email
    DB-->>F: user record
    F->>F: Verify password hash
    F->>F: Generate JWT (access + refresh)
    F-->>U: 200 OK + tokens
    U->>U: Store token, redirect to Home
```

## 2.2 Search Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Flask API
    participant C as Cache (Redis)
    participant DB as PostgreSQL

    U->>F: GET /search?q=Goa&type=hotel
    F->>C: Check cache for query
    alt Cache hit
        C-->>F: Cached results
    else Cache miss
        F->>DB: Query hotels/tickets/guides
        DB-->>F: Results
        F->>C: Store in cache (TTL)
    end
    F-->>U: Search results (JSON)
```

## 2.3 Hotel / Ticket Booking Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Flask API
    participant DB as PostgreSQL
    participant P as Payment Gateway

    U->>F: POST /hotels/:id/book (dates, guests)
    F->>DB: Check availability
    DB-->>F: Available
    F->>DB: Create booking (status=pending)
    F->>P: Initiate payment
    P-->>U: Payment UI / redirect
    U->>P: Complete payment
    P-->>F: Webhook: payment success
    F->>DB: Update booking status=confirmed
    F-->>U: Booking confirmation + email/SMS
```

Ticket booking follows the identical pattern against the `tickets` / `ticket_bookings` tables (seat check instead of date-range availability).

## 2.4 Travel Guide Booking Flow

Same pattern as hotel booking: check guide availability for date range → create pending booking → payment → confirm → notify both user and guide.

## 2.5 Map Integration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Flask API
    participant M as Maps API (Google/Mapbox)

    U->>F: GET /map/poi?lat=&lng=
    F->>M: Fetch nearby attractions/hotels
    M-->>F: POI data
    F-->>U: Normalized POI list
    U->>U: Render markers on map component
```
