import passport from 'passport';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';
import { generateToken, tempTokenAuthMiddleware, jwtAuthMiddleware } from '@/lib/auth';
import { validateEmailDomain, sendVerificationEmail } from '@/lib/emailValidator';
import crypto from 'crypto';

export async function GET(req) {
  try {
    await connectDB();

    // This endpoint initializes the passport middleware
    passport.initialize();
    passport.session();
    require('@/lib/passport-config');

    if (req.user?.isAuthenticated) {
      return Response.json(
        {
          authenticated: true,
          user: req.user,
          message: 'User is authenticated via Google OAuth',
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          authenticated: false,
          message: 'User is not authenticated',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Status check error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
