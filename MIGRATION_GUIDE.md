# Backend Migration Guide: Node.js Express → Next.js API Routes

## Overview
Your Hotel Bazaar backend has been successfully converted from a separate Express.js server to integrated Next.js API routes. This enables seamless deployment to Vercel as a single unified application.

## What Changed

### 1. **Project Structure**
```
Before (Separate Backend):
backend/
├── server.js
├── package.json
├── middlewares/
│   ├── db.js
│   ├── jwt.js
│   ├── googleOAuth.js
│   └── temp-token.js
├── models/
│   ├── user.js
│   ├── products.js
│   └── orders.js
├── Routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
└── utils/
    ├── emailValidator.js
    └── otpUtils.js

After (Integrated Next.js):
frontend/
├── app/
│   └── api/
│       ├── user/
│       │   ├── signup/route.js
│       │   ├── login/route.js
│       │   ├── logout/route.js
│       │   ├── profile/route.js
│       │   ├── profile/password/route.js
│       │   ├── verify-email/route.js
│       │   ├── resend-verification/route.js
│       │   ├── setup-password/route.js
│       │   └── auth/status/route.js
│       ├── product/
│       │   ├── route.js
│       │   └── [id]/route.js
│       ├── order/
│       │   ├── route.js
│       │   └── request-otp/route.js
│       └── auth/
│           └── google/
│               └── callback/route.js
├── lib/
│   ├── db.js
│   ├── auth.js
│   ├── emailValidator.js
│   ├── otpUtils.js
│   ├── passport-config.js
│   └── models/
│       ├── user.js
│       ├── products.js
│       └── orders.js
└── utils/
    └── api.js (updated)
```

### 2. **Migrated Files**

#### Core Setup
- `lib/db.js` - MongoDB connection (ES module compatible)
- `lib/auth.js` - JWT middleware and token generation
- `lib/passport-config.js` - Google OAuth configuration
- `lib/emailValidator.js` - Email validation and SendGrid integration
- `lib/otpUtils.js` - OTP generation and verification

#### Models (Migrated to lib/models/)
- `lib/models/user.js` - User schema with password hashing
- `lib/models/products.js` - Product schema
- `lib/models/orders.js` - Order schema

#### API Routes
All routes now use Next.js API route handlers:
- `/api/user/signup` - User registration
- `/api/user/login` - User authentication
- `/api/user/logout` - User logout
- `/api/user/profile` - Get/update user profile
- `/api/user/profile/password` - Update password
- `/api/user/verify-email` - Email verification
- `/api/user/resend-verification` - Resend verification email
- `/api/user/setup-password` - Setup password for OAuth users
- `/api/user/auth/status` - Check authentication status
- `/api/product` - Get all products, create product
- `/api/product/[id]` - Get, update, delete specific product
- `/api/order` - Get orders, create order, delete order
- `/api/order/request-otp` - Request OTP for order verification
- `/api/auth/google/callback` - Google OAuth callback

### 3. **API URL Changes**

**Before (Express):**
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // e.g., http://localhost:8000
fetch(`${API_BASE_URL}/product`)
fetch(`${API_BASE_URL}/user/login`)
```

**After (Next.js):**
```javascript
fetch(`/api/product`)
fetch(`/api/user/login`)
```

All API calls now use relative URLs pointing to the integrated Next.js backend.

## Environment Variables

Create a `.env.local` file in the frontend directory with:

```env
# MongoDB
MONGODB_URL_LOCAL=mongodb://localhost:27017/hotel-bazaar

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# SendGrid Email
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL=your_verified_sendgrid_email@example.com
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000
NODE_ENV=development
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

This installs both React dependencies AND the backend dependencies (mongoose, passport, etc.)

### 2. Configure Environment Variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### 3. Run Development Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Key Differences in Implementation

### Middleware Handling
**Express:**
```javascript
app.use(jwtAuthMiddleware)
```

**Next.js:**
```javascript
const token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('token')?.value;
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### File Upload Handling
**Express (Multer):**
```javascript
router.post("/", upload.single("image"), async (req, res) => {
  const image = req.file.buffer;
})
```

**Next.js:**
```javascript
const formData = await req.formData();
const imageFile = formData.get('image');
const buffer = await imageFile.arrayBuffer();
```

### Database Connection
**Express:** Connection happens on server startup
**Next.js:** Connection is established on-demand and cached for serverless functions

## Database
Ensure MongoDB is running:
```bash
# Local MongoDB
mongod
```

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Convert backend to Next.js API routes"
git push origin main
```

### 2. Connect to Vercel
- Go to https://vercel.com
- Import your repository
- Vercel will auto-detect Next.js configuration

### 3. Set Environment Variables on Vercel
In Vercel dashboard → Settings → Environment Variables:
- `MONGODB_URL_LOCAL` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `SENDGRID_API_KEY` - SendGrid API key
- `EMAIL` - Verified SendGrid email
- `FRONTEND_URL` - Your Vercel production URL
- `BACKEND_URL` - Your Vercel production URL
- `NODE_ENV` - production

### 4. Deploy
Push to main branch or redeploy from Vercel dashboard.

## Breaking Changes

### Removed
- Separate `backend/` folder and its dependencies
- Express server file (`server.js`)
- CORS configuration (no longer needed - same origin)
- Body parser middleware (Next.js handles this)
- Multer package (can use FormData API)

### Updated
- API base URL from external to relative routes
- JWT middleware implementation
- Database connection pattern (cached for serverless)
- Google OAuth callback URL

## Testing Endpoints

### User Registration
```bash
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123",
    "role": "user"
  }'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/product
```

### Get User Profile
```bash
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Migration Checklist

- [x] Move database connection to `lib/db.js`
- [x] Move models to `lib/models/`
- [x] Migrate authentication middleware to `lib/auth.js`
- [x] Convert all Express routes to Next.js API routes
- [x] Update API calls in frontend to use relative URLs
- [x] Add backend dependencies to package.json
- [x] Create environment variable template
- [ ] Test all endpoints locally
- [ ] Set up MongoDB Atlas for production
- [ ] Configure Vercel deployment
- [ ] Set environment variables on Vercel
- [ ] Deploy to production

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URL_LOCAL` environment variable
- For production, use MongoDB Atlas connection string

### JWT Errors
- Verify `JWT_SECRET` is set in environment
- Check token format in Authorization header

### Email Sending Issues
- Verify SendGrid API key
- Ensure email is verified as sender in SendGrid
- Check email templates in `lib/emailValidator.js`

### Google OAuth Issues
- Verify Google OAuth credentials
- Check redirect URI matches in Google Console
- Ensure `FRONTEND_URL` and `BACKEND_URL` are correct

## Next Steps

1. **Delete the backend folder** (optional, after verification):
   ```bash
   rm -r backend
   ```

2. **Update your repository** with the new structure

3. **Deploy to Vercel** as a single Next.js application

## Support

For issues or questions, refer to:
- Next.js Documentation: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- MongoDB with Node.js: https://docs.mongodb.com/drivers/node/
- Vercel Deployment: https://vercel.com/docs
