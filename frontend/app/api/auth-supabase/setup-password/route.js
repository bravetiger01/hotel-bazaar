import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { phone, password } = await req.json();
    const tempToken = req.headers.get('authorization')?.split(' ')[1];

    if (!tempToken) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Validate phone number
    if (!phone || typeof phone !== 'string' || !/^[0-9]{10}$/.test(phone.trim())) {
      return Response.json({ message: 'Phone number must be exactly 10 digits.' }, { status: 400 });
    }

    // Check if phone already exists
    const { data: existingPhone } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone', phone)
      .neq('id', userId)
      .single();

    if (existingPhone) {
      return Response.json(
        { message: 'An account with this phone number already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({
        phone: phone,
        password: hashedPassword,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Generate new token
    let payload = { id: user.id };
    let token = generateToken(payload);

    return Response.json({ message: 'Profile completed successfully', token }, { status: 200 });
  } catch (err) {
    console.error('Setup password error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
