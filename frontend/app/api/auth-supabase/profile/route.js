import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    // Get token
    let token;
    const authorization = req.headers.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else {
      token = cookies().get('token')?.value;
    }

    if (!token) {
      return Response.json({ error: 'Token Not Found' }, { status: 401 });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    delete user.password;

    return Response.json(user, { status: 200 });
  } catch (err) {
    console.error('Get profile error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    // Get token
    let token;
    const authorization = req.headers.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else {
      token = cookies().get('token')?.value;
    }

    if (!token) {
      return Response.json({ error: 'Token Not Found' }, { status: 401 });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, email, phone, address } = await req.json();

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({
        name: name,
        email: email,
        phone: phone,
        address: address,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Remove password from response
    delete user.password;

    return Response.json(user, { status: 200 });
  } catch (err) {
    console.error('Update profile error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}
