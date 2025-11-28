import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';
import { generateToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/emailValidator';
import crypto from 'crypto';
import passport from '@/lib/passport-config';

export async function GET(req) {
  try {
    await connectDB();

    // Get OAuth code and state from query params
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return new Response('No authorization code received', { status: 400 });
    }

    // Exchange code for tokens using Google API
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    if (!data.access_token) {
      return new Response('Failed to get access token', { status: 400 });
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    const userInfo = await userInfoResponse.json();

    // Find or create user
    let user = await User.findOne({ email: userInfo.email });

    if (!user) {
      user = new User({
        email: userInfo.email,
        name: userInfo.name,
        googleId: userInfo.id,
        emailVerified: true,
        role: 'user',
      });
      await user.save();
    }

    // Check if user already has a password set
    let isFromSignup = false;
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        isFromSignup = stateData.from === 'signup';
      } catch (error) {
        // ignore
      }
    }

    // Send verification email for Google OAuth users (even though they're pre-verified)
    if (!user.verificationToken && user.role !== 'admin') {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      user.verificationToken = verificationToken;
      user.verificationExpires = verificationExpires;
      await user.save();

      // Send verification email
      await sendVerificationEmail(user.email, verificationToken);
    }

    if (!user.password) {
      // User doesn't have a password, redirect to password setup
      let payload = { id: user.id };
      let tempToken = generateToken(payload);

      const redirectUrl = new URL(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/setup-password`
      );
      redirectUrl.searchParams.set('email', user.email);
      redirectUrl.searchParams.set('temp_token', tempToken);

      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl.toString() },
      });
    } else {
      if (isFromSignup) {
        // User tried to sign up but already has account, redirect to login with message
        const redirectUrl = new URL(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
        );
        redirectUrl.searchParams.set('error', 'account_exists');
        redirectUrl.searchParams.set('email', user.email);

        return new Response(null, {
          status: 302,
          headers: { Location: redirectUrl.toString() },
        });
      } else {
        // Normal login flow
        let payload = { id: user.id };
        let token = generateToken(payload);

        const redirectUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/`);
        redirectUrl.searchParams.set('token', token);

        return new Response(null, {
          status: 302,
          headers: { Location: redirectUrl.toString() },
        });
      }
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    const redirectUrl = new URL(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
    );
    redirectUrl.searchParams.set('error', 'oauth_failed');

    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl.toString() },
    });
  }
}
