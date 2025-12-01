'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { getLimitedProducts } from '@/utils/api';

export default function ClearanceSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
  const fetchProducts = async () => {
    const data = await getLimitedProducts();
    setProducts(data);
    setLoading(false);
  };
  fetchProducts();
}, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* ❇️ Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-darkblue mb-4">Top Products</h2>
          <p className="text-gray-600 text-lg">Our most popular picks</p>
        </div>

        {/* ⏳ Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-lg h-72" />
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-8">

              {/* 🧠 FINAL FIX – ARRAY CHECK BEFORE MAP */}
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* 📷 Product Image */}
                    <div className="relative aspect-square bg-gray-100">
                      {product.sale && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-lg">
                          Sale
                        </span>
                      )}

                      {product.stock === 0 && (
                        <span className="absolute top-3 right-3 bg-gray-600 text-white px-2 py-1 text-xs font-semibold rounded-lg">
                          Sold Out
                        </span>
                      )}

                      <img
                        src={product.image_url || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* 🧾 Product Info */}
                    <div className="p-4">
                      <p className="text-gray-500 text-xs mb-1">
                        {product.brand || 'HOTEL BAZAAR'}
                      </p>

                      <h3 className="font-semibold text-darkblue mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* 💰 Price Section */}
                      <div className="flex items-center space-x-2 mb-4">
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ₹{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-red-500 font-bold">
                          ₹{product.price?.toFixed(2) || 'N/A'}
                        </span>
                      </div>

                      {/* 🛒 Action Button */}
                      {product.stock > 0 ? (
                        <button
                          className="w-full flex items-center justify-center space-x-2 bg-darkblue text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all"
                          onClick={() => {
                            addToCart(product, 1);
                            showToast('Product added to cart!', 'success');
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-sm">QUICK ADD</span>
                        </button>
                      ) : (
                        <button className="w-full bg-gray-200 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed">
                          NOTIFY ME
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // ❌ No products case
                <p className="text-center text-gray-500 col-span-full">
                  No products available.
                </p>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-6">
          <Link href="/products">
            <button className="bg-darkblue text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition">
              Load More Products →
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
