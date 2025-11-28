import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';
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
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Allow Google OAuth users and admin users to request OTP even if email not verified
    if (!user.emailVerified && !user.googleId && user.role !== 'admin') {
      return Response.json(
        {
          message:
            'Please verify your email first. Check your inbox for verification email or use Google OAuth to sign in.',
        },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.orderOtp = otp;
    user.orderOtpExpires = otpExpiry;
    await user.save();

    // Send OTP email
    const emailResult = await sendOrderOTP(user.email, otp);

    if (!emailResult.success) {
      return Response.json(
        { message: 'Failed to send OTP', error: emailResult.error },
        { status: 500 }
      );
    }

    return Response.json({ message: 'OTP sent to your email' }, { status: 200 });
  } catch (err) {
    console.error('Request OTP error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
