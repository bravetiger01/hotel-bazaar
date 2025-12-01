'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import { getAllProducts } from '@/utils/api';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(1, 4); // Fetch only 4 products
        const data = response.products || response;
        setProducts(data.slice(0, 4)); // Show only first 4 products
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}