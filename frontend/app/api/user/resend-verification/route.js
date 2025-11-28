import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';
import { sendVerificationEmail } from '@/lib/emailValidator';
import crypto from 'crypto';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'User not found.' }, { status: 404 });
    }

    if (user.emailVerified) {
      return Response.json({ message: 'Email is already verified.' }, { status: 400 });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (emailResult.success) {
      return Response.json({ message: 'Verification email sent successfully!' }, { status: 200 });
    } else {
      return Response.json({ message: 'Failed to send verification email.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
