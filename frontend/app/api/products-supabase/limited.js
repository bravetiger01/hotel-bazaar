// pages/api/products-supabase/limited.js
import { supabase } from '@/utils/supabaseClient';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(3);                     // Only 3 products for home page

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch limited products' });
  }
}
