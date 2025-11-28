# Quick Start Guide - Unified Next.js Application

## What You Need to Know

Your Hotel Bazaar app is now a **single Next.js application** instead of separate frontend and backend servers. Everything is in the `frontend` folder.

## Quick Setup (5 minutes)

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install All Dependencies (Frontend + Backend)
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your credentials:
# - MongoDB connection URL
# - JWT secret
# - Google OAuth credentials
# - SendGrid API key
# - Email configuration
```

### 4. Make Sure MongoDB is Running
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URL_LOCAL in .env.local)
```

### 5. Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

## File Organization

```
frontend/
├── app/              ← Pages and API routes
│   ├── api/         ← Backend API endpoints
│   └── ...          ← Frontend pages
├── lib/             ← Backend utilities
│   ├── db.js        ← Database connection
│   ├── auth.js      ← JWT authentication
│   ├── models/      ← MongoDB schemas
│   └── ...
├── components/      ← React components
├── utils/           ← Frontend utilities
│   └── api.js       ← API client (uses /api/* routes)
└── public/          ← Static files
```

## What's Different

| Aspect | Before | After |
|--------|--------|-------|
| Servers | 2 (backend + frontend) | 1 (Next.js) |
| Backend URL | `http://localhost:8000` | Relative `/api/*` |
| Deployment | Deploy backend & frontend separately | Deploy as single app to Vercel |
| Database Connection | Happens on server startup | Cached on-demand (serverless compatible) |
| Environment Variables | `.env` in `backend/` | `.env.local` in `frontend/` |

## Common Commands

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build         # Build for production
npm start            # Start production server

# Debugging
npm run lint         # Check for errors
```

## API Endpoints

All endpoints are now at `/api/*`:

### User Management
- `POST /api/user/signup` - Register new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/profile/password` - Change password
- `GET /api/user/verify-email?token=...` - Verify email
- `POST /api/user/resend-verification` - Resend verification email
- `POST /api/user/setup-password` - Setup password for OAuth

### Products
- `GET /api/product` - Get all products
- `POST /api/product` - Create product (admin only)
- `GET /api/product/[id]` - Get product by ID
- `PUT /api/product/[id]` - Update product (admin only)
- `DELETE /api/product/[id]` - Delete product (admin only)

### Orders
- `GET /api/order` - Get user orders
- `POST /api/order` - Place order
- `DELETE /api/order?orderId=...` - Delete order
- `POST /api/order/request-otp` - Request OTP

### Authentication
- `GET /api/auth/google/callback` - Google OAuth callback

## Environment Variables Needed

```env
# Database
MONGODB_URL_LOCAL=mongodb://localhost:27017/hotel-bazaar

# JWT
JWT_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Email
SENDGRID_API_KEY=your-sendgrid-key
EMAIL=verified-sender@example.com
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000
NODE_ENV=development
```

## Deployment to Vercel

```bash
# 1. Commit changes
git add .
git commit -m "Unified backend and frontend"
git push

# 2. Go to vercel.com and import your repository
# 3. Add environment variables in Vercel dashboard
# 4. Deploy!
```

## Troubleshooting

**"Cannot find module 'mongoose'"**
- Run `npm install` in the frontend directory

**"MongoDB connection failed"**
- Check MONGODB_URL_LOCAL is correct
- Ensure MongoDB is running (local) or using Atlas

**"Unauthorized" errors on API calls**
- Check JWT token is being sent in Authorization header
- Verify JWT_SECRET matches in .env.local

**"Email sending failed"**
- Verify SendGrid API key
- Ensure email is verified as sender in SendGrid

## Removing the Old Backend Folder

Once everything works, you can delete the old backend folder:

```bash
rm -r backend
```

This is safe because everything has been migrated to the `frontend/app/api/` directory.

## Need Help?

See `MIGRATION_GUIDE.md` for detailed information about the migration process.

---

**Your app is now ready to deploy to Vercel as a single, unified application!** 🚀
