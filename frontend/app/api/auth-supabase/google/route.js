export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from') || 'login';

    const state = Buffer.from(JSON.stringify({ from })).toString('base64');

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set(
      'redirect_uri',
      `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth-supabase/google/callback`
    );
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'email profile');
    googleAuthUrl.searchParams.set('state', state);

    return new Response(null, {
      status: 302,
      headers: { Location: googleAuthUrl.toString() },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return new Response('OAuth initialization failed', { status: 500 });
  }
}
