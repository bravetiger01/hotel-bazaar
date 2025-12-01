import { supabase, supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET single product
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
}

// PUT - Update product
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const formData = await req.formData();

    const updates = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      stock: parseInt(formData.get('stock')),
    };

    const imageFile = formData.get('image');

    // Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          contentType: imageFile.type,
          cacheControl: '3600',
        });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(filePath);
        updates.image_url = urlData.publicUrl;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Product updated', product: data }, { status: 200 });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Get product to delete image
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single();

    // Delete image from storage if exists
    if (product?.image_url) {
      const imagePath = product.image_url.split('/').slice(-2).join('/');
      await supabaseAdmin.storage.from('product-images').remove([imagePath]);
    }

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
