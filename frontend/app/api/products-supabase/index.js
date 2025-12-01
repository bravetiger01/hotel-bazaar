export default async function handler(req, res) {
  const { page = 1, limit = 20, category = null } = req.query;

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to);

  if (category) query = query.eq('category', category);

  const { data, count, error } = await query;

  return res.status(200).json({ total: count, products: data });
}
