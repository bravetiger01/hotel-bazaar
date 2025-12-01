import { supabaseAdmin } from '@/lib/supabase';
import { generateOTP, sendOrderOTP } from '@/lib/otpUtils';

const getUserId = (req) => {
  const authorization = req.headers.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.split(' ')[1];
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;
    } catch (err) {
      return null;
    }
  }
  return null;
};

export async function POST(req) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('email, role')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Skip OTP for admin users
    if (user.role === 'admin') {
      return Response.json({ message: 'Admin users do not need OTP' }, { status: 200 });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Save OTP to user
    await supabaseAdmin
      .from('users')
      .update({
        order_otp: otp,
        order_otp_expires: otpExpires,
      })
      .eq('id', userId);

    // Send OTP email
    const emailResult = await sendOrderOTP(user.email, otp);
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      return Response.json({ message: 'Failed to send OTP email' }, { status: 500 });
    }

    return Response.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (err) {
    console.error('Request OTP error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}
