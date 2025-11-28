import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.json({ message: 'Verification token is required.' }, { status: 400 });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (!user) {
      // Check if token exists but is expired
      const expiredUser = await User.findOne({ verificationToken: token });
      if (expiredUser) {
        return Response.json(
          { message: 'Verification token has expired. Please request a new verification email.' },
          { status: 400 }
        );
      }
      return Response.json({ message: 'Invalid verification token.' }, { status: 400 });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return Response.json({ message: 'Email verified successfully! You can now login.' }, { status: 200 });
  } catch (error) {
    console.error('Email verification error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
