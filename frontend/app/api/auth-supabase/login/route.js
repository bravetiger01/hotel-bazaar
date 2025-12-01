import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Find user by email
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return Response.json({ message: 'no user exists with this email' }, { status: 400 });
    }

    // Check if email is verified (only for non-Google OAuth users and non-admin users)
    if (!user.google_id && !user.email_verified && user.role !== 'admin') {
      return Response.json(
        {
          message:
            'Please verify your email address before logging in. Check your inbox for the verification email.',
          needsVerification: true,
        },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: 'incorrect password' }, { status: 401 });
    }

    let payload = { id: user.id };
    let token = generateToken(payload);

    // Set JWT token in HTTP-only cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json({ role: user.role, token }, { status: 200 });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}
