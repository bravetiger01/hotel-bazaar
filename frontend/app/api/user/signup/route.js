import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';
import { sendVerificationEmail, validateEmailDomain } from '@/lib/emailValidator';
import crypto from 'crypto';

export async function POST(req) {
  try {
    await connectDB();
    const user = await req.json();

    // Validate phone number
    if (!user.phone || typeof user.phone !== 'string' || !/^[0-9]{10}$/.test(user.phone.trim())) {
      return Response.json({ message: 'Phone number must be exactly 10 digits.' }, { status: 400 });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone: user.phone });
    if (existingPhone) {
      return Response.json({ message: 'An account with this phone number already exists.' }, { status: 400 });
    }

    // Validate email
    const emailValidation = await validateEmailDomain(user.email);
    if (!emailValidation.valid) {
      let errorMessage = 'Please enter a valid email address.';
      if (emailValidation.reason === 'disposable_email') {
        errorMessage = 'Please use a valid email address. Disposable email addresses are not allowed.';
      } else if (emailValidation.reason === 'invalid_format') {
        errorMessage = 'Please enter a valid email address format.';
      }
      return Response.json({ message: errorMessage }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return Response.json({ message: 'An account with this email already exists.' }, { status: 400 });
    }

    if (user.role === 'admin') {
      let isAdmin = await User.findOne({ role: 'admin' });
      if (isAdmin) {
        return Response.json({ message: 'There can be only one admin' }, { status: 401 });
      }
    }

    // Generate verification token (skip for admin users)
    let verificationToken, verificationExpires;
    if (user.role !== 'admin') {
      verificationToken = crypto.randomBytes(32).toString('hex');
      verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }

    // Create user with verification fields (admin users are pre-verified)
    user.emailVerified = user.role === 'admin' ? true : false;
    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;

    let newUser = await new User(user);
    let result = await newUser.save();

    // Send verification email (skip for admin users)
    let emailResult = { success: true };
    if (user.role !== 'admin') {
      emailResult = await sendVerificationEmail(user.email, verificationToken);
      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
      }
    }

    return Response.json(
      {
        message:
          user.role === 'admin'
            ? 'Admin account created successfully! You can now login.'
            : 'Account created successfully! Please check your email to verify your account.',
        emailSent: emailResult.success,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Signup error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
