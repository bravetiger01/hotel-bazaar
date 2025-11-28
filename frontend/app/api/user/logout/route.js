import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    cookies().set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      expires: new Date(0),
    });

    return Response.json({ message: 'Logged out' }, { status: 200 });
  } catch (err) {
    console.error('Logout error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}
