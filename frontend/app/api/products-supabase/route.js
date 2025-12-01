import { supabase, supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET products with pagination and caching
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json(
      {
        products: data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create product (admin only)
export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const category = formData.get('category');
    const stock = parseInt(formData.get('stock'));
    const imageFile = formData.get('image');

    // Verify admin token
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let imageUrl = null;

    // Upload image to Supabase Storage if provided
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

      if (uploadError) {
        console.error('Image upload error:', uploadError);
      } else {
        const { data: urlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          name,
          description,
          price,
          category,
          stock,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Product added', product: data }, { status: 201 });
  } catch (error) {
    console.error('Add product error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
