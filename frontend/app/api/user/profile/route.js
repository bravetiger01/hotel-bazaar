import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';
import { jwtAuthMiddleware } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    await connectDB();

    // Manually check for token
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

    let user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (err) {
    console.error('Get profile error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    // Manually check for token
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

    let user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();
    return Response.json(user, { status: 200 });
  } catch (err) {
    console.error('Update profile error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}
