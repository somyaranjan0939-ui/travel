# TravelEase — Technology Stack

## 4.1 Frontend
| Category | Choice |
|---|---|
| Framework | React 18+ |
| Routing | React Router v6 |
| State | Context API / Redux Toolkit |
| HTTP client | Axios |
| Styling | Tailwind CSS / CSS Modules |
| Forms & validation | React Hook Form + Yup/Zod |
| Maps | Google Maps API / Mapbox GL JS |
| Animation | *To be confirmed — see open question below* |

## 4.2 Backend
| Category | Choice |
|---|---|
| Framework | Flask 3.x |
| ORM | SQLAlchemy |
| Auth | Flask-JWT-Extended |
| Validation | Marshmallow / Pydantic |
| Rate limiting | Flask-Limiter |
| Async tasks | Celery + Redis (optional) |
| API docs | Flask-Smorest / Swagger (OpenAPI) |

## 4.3 Database
| Category | Choice |
|---|---|
| Primary DB | PostgreSQL 15+ |
| Caching | Redis (optional, for search/session) |
| Migrations | Alembic |

## 4.4 DevOps & Infrastructure
| Category | Choice |
|---|---|
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Hosting (frontend) | Vercel / Netlify / S3+CloudFront |
| Hosting (backend) | Render / AWS EC2 / ECS |
| Hosting (DB) | AWS RDS / Supabase / Render Postgres |
| Monitoring | Sentry (errors) + Prometheus/Grafana (metrics) |

## 4.5 Open Question — Animation Library
Awaiting your choice between Framer Motion, GSAP, CSS-only, or "you decide" (see chat) before this section is finalized.
