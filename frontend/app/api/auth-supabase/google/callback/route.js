// /app/api/auth-supabase/google/callback/route.js

import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/emailValidator';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  // Safe base URL generation → works in Vercel & Locally
  const BASE_URL =
    process.env.FRONTEND_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    // 1️⃣ Get OAuth code & state
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return new Response('No authorization code received', { status: 400 });
    }

    // 2️⃣ Google Token Exchange API
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/api/auth-supabase/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    if (!data.access_token) {
      return new Response('Failed to get access token', { status: 400 });
    }

    // 3️⃣ Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const userInfo = await userInfoResponse.json();

    // 4️⃣ Check if user exists in Supabase
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', userInfo.email)
      .single();

    let user = existingUser;

    // 5️⃣ Create new user if not found
    if (!user) {
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert([
          {
            email: userInfo.email,
            name: userInfo.name,
            google_id: userInfo.id,
            email_verified: true,
            role: 'user',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      user = newUser;
    }

    // 6️⃣ Read state to check signup/login
    let isFromSignup = false;
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        isFromSignup = stateData.from === 'signup';
      } catch {}
    }

    // 7️⃣ Redirect Based on Login Condition
    if (!user.password) {
      // No password → setup flow
      let tempToken = generateToken({ id: user.id });
      const redirectUrl = new URL(`${BASE_URL}/auth/setup-password`);
      redirectUrl.searchParams.set('email', user.email);
      redirectUrl.searchParams.set('temp_token', tempToken);

      return new Response(null, {
        status: 302,
        headers: { Location: redirectUrl.toString() },
      });
    } else {
      if (isFromSignup) {
        // Already exists → login screen
        const redirectUrl = new URL(`${BASE_URL}/login`);
        redirectUrl.searchParams.set('error', 'account_exists');
        redirectUrl.searchParams.set('email', user.email);

        return new Response(null, {
          status: 302,
          headers: { Location: redirectUrl.toString() },
        });
      } else {
        // Normal login flow
        let token = generateToken({ id: user.id });
        const redirectUrl = new URL(`${BASE_URL}/`);
        redirectUrl.searchParams.set('token', token);

        return new Response(null, {
          status: 302,
          headers: { Location: redirectUrl.toString() },
        });
      }
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    const redirectUrl = new URL(`${BASE_URL}/login`);
    redirectUrl.searchParams.set('error', 'oauth_failed');

    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl.toString() },
    });
  }
}
