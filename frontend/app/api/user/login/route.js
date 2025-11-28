import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    let user = await User.findOne({ email: email });
    if (!user) {
      return Response.json({ message: 'no user exists with this email' }, { status: 400 });
    }

    // Check if email is verified (only for non-Google OAuth users and non-admin users)
    if (!user.googleId && !user.emailVerified && user.role !== 'admin') {
      return Response.json(
        {
          message:
            'Please verify your email address before logging in. Check your inbox for the verification email.',
          needsVerification: true,
        },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
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
