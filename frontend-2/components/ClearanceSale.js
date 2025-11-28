'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts } from '@/utils/api';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

export default function ClearanceSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.slice(0, 3)); // Show any 3 products
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-gray-50 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-darkblue mb-4">Top Products</h2>
        </div>
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-8">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-200">
                    {product.sale && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                        Sale
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-3 right-3 bg-gray-600 text-white px-2 py-1 text-xs font-semibold rounded">
                        Sold Out
                      </span>
                    )}
                    <img
                      src={product.image || '/api/placeholder/300/300'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-gray-500 text-xs mb-1">{product.brand || 'HOTEL BAZAAR'}</p>
                    <h3 className="font-semibold text-darkblue mb-2 line-clamp-2">{product.name}</h3>
                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-3">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">Rs. {product.originalPrice.toFixed(2)}</span>
                      )}
                      <span className="text-red-500 font-bold">Rs. {product.price?.toFixed(2) || 'N/A'}</span>
                    </div>
                    {/* Action Button */}
                    {product.stock !== 0 ? (
                      <button
                        className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-darkblue py-2 px-4 rounded hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          addToCart(product, 1);
                          showToast('Product added to cart!', 'success');
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">QUICK ADD</span>
                      </button>
                    ) : (
                      <button className="w-full bg-gray-200 text-gray-500 py-2 px-4 rounded cursor-not-allowed">
                        NOTIFY ME
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-center">
          <Link href="/products">
            <button className="bg-darkblue text-white px-8 py-3 rounded hover:bg-opacity-90 transition-colors">
              Load More Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}