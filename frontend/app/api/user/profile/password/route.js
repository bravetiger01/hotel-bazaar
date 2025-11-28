import { connectDB } from '@/lib/db';
import User from '@/lib/models/user';

export async function PUT(req) {
  try {
    await connectDB();

    // Manually check for token
    let token;
    const authorization = req.headers.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else {
      token = req.cookies.get('token')?.value;
    }

    if (!token) {
      return Response.json({ error: 'Token Not Found' }, { status: 401 });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { currPassword, newPassword } = await req.json();

    if (currPassword === newPassword) {
      return Response.json(
        { message: 'your new password can be your curr password' },
        { status: 400 }
      );
    }

    let user = await User.findById(userId);
    let isMatch = await user.comparePassword(currPassword);
    if (!isMatch) {
      return Response.json({ message: 'incorrect current password' }, { status: 401 });
    }

    user.password = newPassword;
    await user.save();

    return Response.json({ message: 'password updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Password update error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}
