import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/emailValidator';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  try {
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
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth-supabase/google/callback`,
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
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', userInfo.email)
      .single();

    let user = existingUser;

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
