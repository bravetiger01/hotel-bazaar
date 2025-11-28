import { connectDB } from '@/lib/db';
import Product from '@/lib/models/products';
import User from '@/lib/models/user';
import NodeCache from 'node-cache';

const nodeCache = new NodeCache();

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === 'admin';
  } catch (err) {
    return false;
  }
};

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
    let result;

    if (nodeCache.has('result')) {
      result = JSON.parse(nodeCache.get('result'));
    } else {
      result = await Product.find();
      nodeCache.set('result', JSON.stringify(result));
    }

    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error('Get products error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId || !(await checkAdminRole(userId))) {
      return Response.json({ message: 'only admin is allowed to add products' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const category = formData.get('category');
    const stock = formData.get('stock');
    const orderedBy = formData.get('orderedBy');
    const imageFile = formData.get('image');

    let image = '';
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      image = `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`;
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      orderedBy,
      image,
    });

    await product.save();

    return Response.json({ message: 'Product added', product }, { status: 201 });
  } catch (err) {
    console.error('Add product error:', err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
