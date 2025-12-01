import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';
import { sendVerificationEmail, validateEmailDomain } from '@/lib/emailValidator';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const user = await req.json();

    // Validate phone number
    if (!user.phone || typeof user.phone !== 'string' || !/^[0-9]{10}$/.test(user.phone.trim())) {
      return Response.json({ message: 'Phone number must be exactly 10 digits.' }, { status: 400 });
    }

    // Check if phone already exists
    const { data: existingPhone } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone', user.phone)
      .single();

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
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (existingUser) {
      return Response.json({ message: 'An account with this email already exists.' }, { status: 400 });
    }

    // Check if trying to create admin
    if (user.role === 'admin') {
      const { data: isAdmin } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .single();

      if (isAdmin) {
        return Response.json({ message: 'There can be only one admin' }, { status: 401 });
      }
    }

    // Generate verification token (skip for admin users)
    let verificationToken, verificationExpires;
    if (user.role !== 'admin') {
      verificationToken = crypto.randomBytes(32).toString('hex');
      verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Create user in Supabase
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
          password: hashedPassword,
          role: user.role || 'user',
          email_verified: user.role === 'admin' ? true : false,
          verification_token: verificationToken,
          verification_expires: verificationExpires,
        },
      ])
      .select()
      .single();

    if (error) throw error;

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
