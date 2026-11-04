# TravelEase — Security Architecture

## 3.1 Authentication & Authorization
- Password hashing with **bcrypt** (never store plaintext)
- **JWT** access tokens (short-lived, ~15 min) + refresh tokens (stored as httpOnly secure cookies)
- Role-based access control (RBAC): `user`, `guide`, `admin`
- Protected routes verified via Flask middleware/decorators (`@jwt_required`)

## 3.2 Data Protection
- **HTTPS/TLS** enforced everywhere (HSTS headers)
- Sensitive fields (payment refs) encrypted at rest where applicable
- PostgreSQL access restricted by network rules; least-privilege DB users
- Regular automated backups with encryption

## 3.3 API Security
- Input validation & sanitization on every endpoint (e.g., Marshmallow/Pydantic schemas)
- Parameterized queries via SQLAlchemy ORM to prevent SQL injection
- CORS configured to allow only the known frontend origin
- Rate limiting (Flask-Limiter) on auth and booking endpoints to prevent brute force/abuse
- CSRF protection for state-changing requests where cookies are used
- Centralized error handling that avoids leaking stack traces/internal details

## 3.4 Infrastructure Security
- Environment secrets (DB creds, JWT secret, API keys) stored in environment variables / secrets manager — never in source
- Dependency scanning (pip-audit / npm audit) in CI
- Web Application Firewall (WAF) or Nginx-level protections against common attack patterns
- Security headers: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`

## 3.5 Payment Security
- No raw card data touches your servers — use a PCI-DSS compliant gateway (Stripe/Razorpay) with tokenization
- Verify payment webhooks via signature validation
- Idempotency keys on booking/payment creation to prevent double charges

## 3.6 Security Checklist
- [ ] Passwords hashed (bcrypt/argon2)
- [ ] JWT with short expiry + refresh rotation
- [ ] HTTPS enforced
- [ ] Input validation on all endpoints
- [ ] Rate limiting on auth/booking routes
- [ ] CORS locked to known origins
- [ ] Secrets in env vars/secrets manager
- [ ] Payment via PCI-compliant gateway only
- [ ] Regular dependency & vulnerability scans
- [ ] Audit logging on bookings/payments
