import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();

    // Manually check for temp token
    let token;
    const authorization = req.headers.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else {
      token = req.cookies.get('temp_token')?.value;
    }

    if (!token) {
      return Response.json({ error: 'Temp token not found' }, { status: 401 });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { password, phone } = await req.json();

    if (!password || password.length < 6) {
      return Response.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      return Response.json({ message: 'Phone number must be exactly 10 digits.' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if phone is already taken by another user
    const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
    if (existingPhone) {
      return Response.json(
        { message: 'An account with this phone number already exists.' },
        { status: 400 }
      );
    }

    user.password = password;
    user.phone = phone;
    await user.save();

    let payload = { id: user.id };
    let newToken = generateToken(payload);

    return Response.json({ message: 'Profile completed successfully', token: newToken }, { status: 200 });
  } catch (error) {
    console.error('Setup password error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
