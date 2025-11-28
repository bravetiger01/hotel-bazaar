import { connectDB } from '@/lib/db';
import Order from '@/lib/models/orders';
import User from '@/lib/models/user';
import Product from '@/lib/models/products';
import { generateOTP, sendOrderOTP, verifyOTP } from '@/lib/otpUtils';
import { sendOrderNotification } from '@/lib/emailValidator';

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

export async function GET(req) {
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

    let result;
    if (user.role === 'admin') {
      // Return all orders for admin
      result = await Order.find();
    } else {
      // Return only this user's orders
      await user.populate('orders');
      result = user.orders;
    }

    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error('Get orders error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { products, otp, total, customer } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify OTP (skip for admin users)
    if (user.role !== 'admin') {
      if (!verifyOTP(user.orderOtp, user.orderOtpExpires, otp)) {
        return Response.json({ message: 'Invalid or expired OTP' }, { status: 400 });
      }

      // Clear OTP after successful verification
      user.orderOtp = null;
      user.orderOtpExpires = null;
      await user.save();
    }

    const order = new Order({
      username: user.name,
      products,
      orderDate: new Date(),
    });
    await order.save();

    // Decrement product quantity in the DB when an order is placed.
    const updatedProducts = [];
    for (const item of products) {
      const product = await Product.findById(item._id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
        updatedProducts.push(product);
      }
    }

    user.orders.push(order._id);
    await user.save();

    // Send admin notification email
    const emailResult = await sendOrderNotification(
      { products, total, orderDate: order.orderDate },
      { name: user.name, email: user.email, phone: user.phone }
    );
    if (!emailResult.success) {
      console.log('Failed to send admin notification:', emailResult.error);
    }

    return Response.json(
      { message: 'Order placed successfully', order, updatedProducts },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create order error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    await User.findByIdAndUpdate(userId, { $pull: { orders: orderId } });

    const result = await Order.findByIdAndDelete(orderId);
    if (!result) {
      return Response.json({ message: 'Order not found' }, { status: 404 });
    }

    return Response.json({ message: 'Order deleted', result }, { status: 200 });
  } catch (err) {
    console.error('Delete order error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}
