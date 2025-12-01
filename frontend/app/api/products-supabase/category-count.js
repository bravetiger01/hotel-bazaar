// pages/api/products-supabase/category-count.js
import { supabase } from '@/utils/supabaseClient';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category, count:id', { count: 'exact' })
      .group('category');

    if (error) throw error;

    const counts = {};
    data.forEach(item => {
      counts[item.category] = item.count;
    });

    return res.status(200).json(counts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch category count' });
  }
}
