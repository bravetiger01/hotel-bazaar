# Hotel Bazaar — Full‑stack E‑commerce for Hospitality Supplies

Modern, production‑ready e‑commerce web app for a hospitality client. It includes product catalog, category filtering, cart, secure checkout with email OTP, user authentication (email/password + Google OAuth), email verification, profile management, and an admin dashboard for product management.

> Why this project stands out for recruiters
>
> - Real client use case with pragmatic tradeoffs and guardrails
> - Clean separation of concerns: Next.js frontend + Express/Mongo backend
> - User trust features: email verification and OTP‑verified ordering
> - Admin workflow: secure product CRUD with image uploads and stock management
>

## Tech stack

- Frontend: Next.js 13 (App Router), React 18, Tailwind CSS, Radix UI, shadcn‑style components
- Backend: Node.js (Express 5), MongoDB (Mongoose 8), JWT auth, Passport Google OAuth 2.0
- Messaging/Email: Nodemailer (Gmail SMTP)
- File handling: Multer (memory storage -> base64 images)
- Security: bcrypt password hashing, HTTP‑only cookies for classic login, JWT (7d expiry)


## Monorepo layout

```
root
├─ backend-2/             # Express API (auth, products, orders)
│  ├─ server.js
│  ├─ Routes/
│  ├─ middlewares/
│  ├─ models/
│  └─ utils/
└─ frontend-2/            # Next.js frontend (App Router)
   ├─ app/                # pages and routes
   ├─ components/
   ├─ hooks/
   └─ utils/
```


## Features at a glance

- Browsing & discovery
  - Product catalog with categories, clear visual cards, and a hero section
  - Client-side category filtering via URL query
- Cart & checkout
  - Local cart management, order summary, and free shipping placeholder
  - OTP verification by email before order placement (fraud/typo guard)
- Authentication & security
  - Email/password login with bcrypt hashing
  - Google OAuth 2.0 with profile completion flow (phone + password)
  - Email verification link on signup (+ resend) to reduce spam/disposables
  - JWT (Bearers) for API access; 7‑day token lifetime
- User account
  - Profile view/edit (name, phone, address), password update
  - Order history snapshot
- Admin flows (role=admin)
  - Add/Edit/Delete products, image upload, category, price, stock
  - Stock decremented when orders are placed


## Architecture

```
[ Next.js (frontend-2) ]  --(fetch/rewrites)-->  [ Express API (backend-2) ]  --(Mongoose)-->  [ MongoDB ]
                                               ↳ Nodemailer (Gmail SMTP)
                                               ↳ Google OAuth (Passport)
```

- Frontend talks to the backend via Next.js rewrites (configurable with NEXT_PUBLIC_BACKEND_URL)
- Backend exposes REST endpoints for users/products/orders
- JWT secures protected routes; Google OAuth callback issues a token and returns it to the frontend
- Email verification and order OTP are delivered over Gmail SMTP (configurable)


## Environment variables

Create these files before running locally.

### backend-2/.env

```
# Server
PORT=8000
NODE_ENV=development
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URL_LOCAL=mongodb://localhost:27017/hotel-bazaar

# Auth
JWT_SECRET=replace-with-strong-random-secret

# Google OAuth (create a Google OAuth 2.0 Web app)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
# Add this as an authorized redirect URI:
# http://localhost:8000/user/api/auth/google/callback

# Email (Nodemailer via Gmail SMTP)
EMAIL_USER=your-gmail-address
EMAIL_PASS=your-gmail-app-password
```

Tip: For production, use a dedicated SMTP provider and separate SESSION_SECRET. Cookies should be secure and sameSite="none" behind HTTPS.

### frontend-2/.env.local

```
# Direct base URL used by fetch helpers (optional when using rewrites)
NEXT_PUBLIC_API_URL=http://localhost:8000
# Rewrites backend base used by next.config.js
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```


## Local development (Windows PowerShell)

1) Start the API

```powershell
cd backend-2
npm install
node server.js
```

2) Start the frontend

```powershell
cd ../frontend-2
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000 (health: GET /)

If Google OAuth is enabled, ensure your Google app’s Authorized redirect URI matches: http://localhost:8000/user/api/auth/google/callback


## User flows

- Sign up: User enters name/email/phone/password -> verification email sent -> verify at /auth/verify?token=...
- Login: Email/password or “Continue with Google”
- Google OAuth: After consent, if password not set yet, user completes profile (phone + password) via a secure temp token
- Place order: User requests OTP via email -> enters OTP at checkout -> order placed and stock decremented
- Admin: Admin token is required to create/edit/delete products


## API overview (selected)

Base URL: http://localhost:8000

- Auth & users (/user)
  - POST /signup — create account; rejects disposable emails and duplicate phone/email
  - GET /verify-email?token=… — marks email as verified
  - POST /resend-verification — resends verification email
  - POST /login — returns JWT in cookie and response body
  - GET /profile — get current user (JWT)
  - PUT /profile — update profile (JWT)
  - PUT /profile/password — change password (JWT)
  - POST /logout — clears token cookie
  - GET /api/auth/google — starts Google OAuth (with optional state)
  - GET /api/auth/google/callback — OAuth callback; issues token or asks for password setup
  - POST /setup-password — complete Google signup (temp token)

- Products (/product)
  - GET / — list all products
  - GET /:productId — get a single product
  - POST / — create (admin, JWT, multipart image)
  - PUT /:productId — update (admin, JWT, multipart image)
  - DELETE /:productId — delete (admin, JWT)

- Orders (/order)
  - POST /request-otp — send OTP to user’s email (JWT)
  - POST / — place order with OTP (JWT; admin bypasses OTP)
  - GET / — user’s orders; admin gets all orders (JWT)
  - DELETE /:orderId — delete order from user and DB (JWT)


## Admin setup

- Only one admin is allowed by design (guardrail in /user/signup)
- For initial seeding, you can create an admin account by calling POST /user/signup with an additional field `role: "admin"` (e.g., via Postman) or by updating a user’s role in MongoDB
- Admin UI: /admin/dashboard (frontend enforces actions via backend role checks)


## Security notes

- Passwords are hashed with bcrypt and never stored in plaintext
- JWTs expire in 7 days; scoped via Bearer header (and cookie for classic login)
- Email verification reduces fake/disposable signups; OTP reduces fraudulent orders
- For production, require HTTPS, set secure cookies, rotate secrets, and consider rate limiting


## Deployment checklist

- Frontend (Vercel/Netlify/Static SSR host)
  - Set NEXT_PUBLIC_BACKEND_URL to your API base
  - Configure NEXT_PUBLIC_API_URL if you’re not using rewrites
- Backend (Render/Railway/Azure/EC2/etc.)
  - Set all backend .env vars, including DB, JWT, Google, and SMTP
  - Configure CORS to allow your frontend origin
- Google Cloud Console
  - Add the deployed callback URL: https://api.yourdomain.com/user/api/auth/google/callback


## Screenshots (placeholders)

Add project screenshots here for quick visual context:

- Home and categories
- Product listing and details
- Cart and checkout (OTP step)
- Profile and orders
- Admin dashboard (product CRUD)


## Roadmap / nice‑to‑haves

- Payment gateway integration (Razorpay/Stripe)
- Inventory low‑stock alerts and bulk import
- Better image handling (cloud storage + CDN)
- Role management and activity logs
- E2E tests (Playwright/Cypress)


## License

This is a client project. All rights reserved.

---

Questions or feedback? I’m happy to walk you through the code and design decisions.
