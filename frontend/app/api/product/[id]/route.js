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

export async function GET(req, { params }) {
  try {
    await connectDB();
    const productId = params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    return Response.json(product, { status: 200 });
  } catch (err) {
    console.error('Get product error:', err);
    return Response.json({ message: 'internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId || !(await checkAdminRole(userId))) {
      return Response.json({ message: 'only admin is allowed to update products' }, { status: 401 });
    }

    const productId = params.id;
    const formData = await req.formData();

    const updatedProductData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      category: formData.get('category'),
      stock: formData.get('stock'),
    };

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      updatedProductData.image = `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`;
    }

    const result = await Product.findByIdAndUpdate(productId, updatedProductData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return Response.json({ error: 'product not found' }, { status: 404 });
    }

    nodeCache.del('result');
    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error('Update product error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId || !(await checkAdminRole(userId))) {
      return Response.json({ message: 'only admin is allowed to delete products' }, { status: 401 });
    }

    const productId = params.id;
    const result = await Product.findByIdAndDelete(productId);

    if (!result) {
      return Response.json({ error: 'product not found' }, { status: 404 });
    }

    nodeCache.del('result');
    return Response.json({ message: 'product deleted', result }, { status: 200 });
  } catch (err) {
    console.error('Delete product error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
