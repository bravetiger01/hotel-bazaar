'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/utils/api';



export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the search params from the URL
  const searchParams = useSearchParams();
  const category = searchParams.get('category'); // Get the 'category' parameter

  

  // Effect to fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllProducts(1, 100); // Fetch first 100 products
        setProducts(response.products || response); // Handle both old and new API format
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Empty dependency array means this runs only once on mount

  // Effect to filter products whenever the category or the main product list changes
  useEffect(() => {
    if (category) {
      // If a category is present in the URL, filter the products
      const filtered = products.filter(p => p.category === category);
      setFilteredProducts(filtered);
    } else {
      // If no category, show all products
      setFilteredProducts(products);
    }
  }, [category, products]); // Re-run this effect if category or products change

  const pageTitle = category ? `${category} Products` : 'All Our Products';

  return (
    <div className="min-h-screen bg-black">
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">{pageTitle}</h1>
        
        {loading && <div className="text-center py-12 text-gray-400">Loading products...</div>}
        {error && <div className="text-center py-12 text-red-400">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Optional: Show a message if no products are found in a category */}
        {!loading && !error && filteredProducts.length === 0 && (
           <div className="text-center py-12 text-gray-400">
             No products found in this category.
           </div>
        )}
      </div>
    </div>
  );
}