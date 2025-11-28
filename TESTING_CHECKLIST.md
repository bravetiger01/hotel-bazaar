# Testing Checklist for Hotel Bazaar API Migration

## Pre-Testing Setup

- [ ] MongoDB is running locally (`mongod`) or MongoDB Atlas URI configured
- [ ] `.env.local` file created with all required environment variables
- [ ] Dependencies installed (`npm install` in frontend directory)
- [ ] Development server started (`npm run dev`)
- [ ] Server running on http://localhost:3000

## Authentication Tests

### User Registration
- [ ] POST `/api/user/signup` with valid data creates user
- [ ] Email validation prevents disposable emails
- [ ] Phone number validation requires 10 digits
- [ ] Duplicate email returns error
- [ ] Duplicate phone returns error
- [ ] Admin creation blocked if admin already exists
- [ ] Verification email sent to new users
- [ ] Admin users skip verification requirement

### Email Verification
- [ ] Verification link in email works
- [ ] GET `/api/user/verify-email?token=<token>` marks email verified
- [ ] Expired token shows appropriate error
- [ ] Invalid token shows appropriate error
- [ ] Resend verification email sends new link
- [ ] Resend fails for already verified email

### User Login
- [ ] POST `/api/user/login` with correct credentials returns token
- [ ] Login fails with wrong password
- [ ] Login fails with non-existent email
- [ ] Unverified users can't login (except Google OAuth & admin)
- [ ] JWT token has 7-day expiration
- [ ] Token stored in httpOnly cookie and response

### User Logout
- [ ] POST `/api/user/logout` clears authentication cookie
- [ ] After logout, protected endpoints return 401

### Profile Management
- [ ] GET `/api/user/profile` returns authenticated user's profile
- [ ] PUT `/api/user/profile` updates name, email, phone, address
- [ ] PUT `/api/user/profile/password` updates password
- [ ] Password update fails with incorrect current password
- [ ] Can't set new password same as current password
- [ ] Profile accessible only with valid token
- [ ] Password change fails without authorization

### Google OAuth
- [ ] Google OAuth button initiates correct flow
- [ ] Callback from Google OAuth processes correctly
- [ ] New Google users auto-create account
- [ ] Existing Google users are found and logged in
- [ ] Google users get redirect to password setup if no password
- [ ] After setup, Google users can login normally
- [ ] Verification email sent to Google OAuth users

### Setup Password (OAuth)
- [ ] POST `/api/user/setup-password` with temp token works
- [ ] Requires password minimum 6 characters
- [ ] Requires phone number exactly 10 digits
- [ ] Prevents duplicate phone numbers
- [ ] Returns new JWT token after setup

## Product Tests

### Get Products
- [ ] GET `/api/product` returns all products
- [ ] Products return with all fields (name, price, stock, image, etc.)
- [ ] Caching works (second call should be faster)
- [ ] Cache clears after product update/delete

### Create Product (Admin Only)
- [ ] POST `/api/product` with admin token creates product
- [ ] Non-admin users get 401 error
- [ ] Unauthenticated users get 401 error
- [ ] Product image uploads and converts to base64
- [ ] Product saves with all required fields
- [ ] Returns created product data

### Get Single Product
- [ ] GET `/api/product/:id` returns product by ID
- [ ] Invalid ID returns 404
- [ ] Returns complete product data including image

### Update Product (Admin Only)
- [ ] PUT `/api/product/:id` updates product
- [ ] Non-admin users get 401 error
- [ ] Can update image
- [ ] Can update without image (preserves old image)
- [ ] All fields can be updated
- [ ] Cache clears after update

### Delete Product (Admin Only)
- [ ] DELETE `/api/product/:id` removes product
- [ ] Non-admin users get 401 error
- [ ] Returns 404 for non-existent product
- [ ] Cache clears after delete

## Order Tests

### Request OTP
- [ ] POST `/api/order/request-otp` generates and sends OTP
- [ ] OTP sent via email
- [ ] OTP stored in user record
- [ ] OTP expires after 10 minutes
- [ ] Non-verified users can't request OTP
- [ ] Unverified non-Google users get error
- [ ] Google OAuth users can request OTP without verification

### Place Order
- [ ] POST `/api/order` with valid OTP creates order
- [ ] Order fails with invalid OTP
- [ ] Order fails with expired OTP
- [ ] OTP clears after successful use
- [ ] Product quantities decrease after order
- [ ] Quantity doesn't go below 0
- [ ] Order saved to user's orders array
- [ ] Admin notification email sent
- [ ] Order contains all product details

### Get Orders
- [ ] GET `/api/order` returns user's orders for regular users
- [ ] GET `/api/order` returns all orders for admins
- [ ] Unauthorized users get 401
- [ ] Returns complete order data

### Delete Order
- [ ] DELETE `/api/order?orderId=<id>` removes order
- [ ] Order removed from user's orders array
- [ ] Non-existent order returns 404
- [ ] Unauthorized users get 401

## Security Tests

### JWT Authentication
- [ ] Invalid token rejected
- [ ] Expired token rejected
- [ ] Missing token returns 401
- [ ] Token from Authorization header works
- [ ] Token from cookie works
- [ ] Bearer prefix parsed correctly

### Authorization
- [ ] Non-admin can't create products
- [ ] Non-admin can't update products
- [ ] Non-admin can't delete products
- [ ] Regular users see only their orders
- [ ] Admins see all orders

### Password Security
- [ ] Passwords are bcrypt hashed
- [ ] Old passwords visible in database
- [ ] Can't compare plain text with hashed

## Email Tests

### Verification Email
- [ ] Verification email template renders correctly
- [ ] Verification link works
- [ ] Email from verified sender

### OTP Email
- [ ] OTP email sends with correct format
- [ ] OTP displays clearly in email
- [ ] 10-minute expiry mentioned

### Order Notification Email
- [ ] Admin receives order notification
- [ ] Email contains customer details
- [ ] Email contains product list with quantities and prices
- [ ] Email shows grand total
- [ ] Formatted HTML email renders well

## Error Handling Tests

### Validation Errors
- [ ] Invalid email format rejected
- [ ] Invalid phone format rejected
- [ ] Missing required fields rejected
- [ ] Appropriate error messages returned

### Database Errors
- [ ] Connection errors handled gracefully
- [ ] Server returns 500 on DB failure
- [ ] Console logs errors for debugging

### API Error Responses
- [ ] 400 for bad requests
- [ ] 401 for unauthorized access
- [ ] 404 for not found
- [ ] 500 for server errors

## Performance Tests

### Caching
- [ ] Products endpoint uses cache
- [ ] Cache updates after product changes
- [ ] Multiple requests don't hit database

### Database Connections
- [ ] Connection is reused (not creating new connections each request)
- [ ] Serverless-compatible connection pooling

## Environment Variable Tests

- [ ] App starts without `NEXT_PUBLIC_API_URL`
- [ ] All required env vars are used correctly
- [ ] Missing env vars don't crash app (graceful fallback)

## Frontend Integration Tests

### API Call Updates
- [ ] Frontend calls use `/api/*` URLs
- [ ] Authorization header sent correctly
- [ ] Cookies handled properly
- [ ] Errors displayed to user

### Component Tests
- [ ] Login form works
- [ ] Signup form works
- [ ] Product list loads
- [ ] Admin panel functions
- [ ] Order placement works

## Browser/Client Tests

### Different Clients
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works with cURL
- [ ] Works with Postman

### Cookie/Storage
- [ ] JWT token stored in cookie
- [ ] Cookies sent automatically
- [ ] LocalStorage used where appropriate

## Load Tests (Optional)

- [ ] Can handle multiple concurrent requests
- [ ] API remains responsive under load
- [ ] Database connections don't exhaust

## Production Deployment Tests

- [ ] Build completes without errors (`npm run build`)
- [ ] Production server starts (`npm start`)
- [ ] All endpoints work in production mode
- [ ] Environment variables loaded correctly on Vercel

## Final Verification

- [ ] All API routes created and working
- [ ] All database models functioning
- [ ] Authentication/Authorization working
- [ ] Email functionality operational
- [ ] Frontend integrated properly
- [ ] Ready for deployment

---

## Test Execution Commands

```bash
# Test with curl
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234567890","password":"password123"}'

# Test authentication
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test products
curl http://localhost:3000/api/product

# Test order
curl -X POST http://localhost:3000/api/order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"products":[{"_id":"...","quantity":1}],"otp":"123456","total":100}'
```

---

**Test Status**: [ ] All tests passing  
**Date Tested**: ___________  
**Tested By**: ___________  
**Issues Found**: ___________ 
