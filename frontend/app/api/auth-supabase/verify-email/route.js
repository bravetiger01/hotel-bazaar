import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.json({ message: 'Verification token is required' }, { status: 400 });
    }

    // Find user with this verification token
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (error || !user) {
      return Response.json({ message: 'Invalid verification token' }, { status: 400 });
    }

    // Check if already verified
    if (user.email_verified) {
      return Response.json({ message: 'Email is already verified' }, { status: 400 });
    }

    // Check if token expired
    if (new Date() > new Date(user.verification_expires)) {
      return Response.json({ message: 'Verification token has expired' }, { status: 400 });
    }

    // Update user as verified
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_expires: null,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return Response.json({ message: 'Email verified successfully!' }, { status: 200 });
  } catch (err) {
    console.error('Verify email error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
