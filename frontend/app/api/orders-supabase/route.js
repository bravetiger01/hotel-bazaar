import { supabaseAdmin } from '@/lib/supabase';
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
    const userId = getUserId(req);

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role, name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    let orders;
    if (user.role === 'admin') {
      // Return all orders for admin
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;
      orders = data;
    } else {
      // Return only this user's orders
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('username', user.name)
        .order('order_date', { ascending: false });

      if (error) throw error;
      orders = data;
    }

    // Transform for compatibility
    const transformedOrders = orders.map(order => ({
      ...order,
      _id: order.id, // For backward compatibility
    }));

    return Response.json(transformedOrders, { status: 200 });
  } catch (err) {
    console.error('Get orders error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { products, otp, total } = await req.json();

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify OTP (skip for admin users)
    if (user.role !== 'admin') {
      if (!verifyOTP(user.order_otp, user.order_otp_expires, otp)) {
        return Response.json({ message: 'Invalid or expired OTP' }, { status: 400 });
      }

      // Clear OTP after successful verification
      await supabaseAdmin
        .from('users')
        .update({
          order_otp: null,
          order_otp_expires: null,
        })
        .eq('id', userId);
    }

    // Create order with products as JSONB
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          username: user.name,
          products: products, // Store as JSONB
          order_date: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Update product stock
    const updatedProducts = [];
    for (const item of products) {
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('stock')
        .eq('id', item._id || item.id)
        .single();

      if (!productError && product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await supabaseAdmin
          .from('products')
          .update({ stock: newStock })
          .eq('id', item._id || item.id);

        updatedProducts.push({ ...product, stock: newStock });
      }
    }

    // Send admin notification email
    const emailResult = await sendOrderNotification(
      { products, total, orderDate: order.order_date },
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
    const userId = getUserId(req);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    // Delete order
    const { error } = await supabaseAdmin.from('orders').delete().eq('id', orderId);

    if (error) throw error;

    return Response.json({ message: 'Order deleted' }, { status: 200 });
  } catch (err) {
    console.error('Delete order error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}
