'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { getLimitedProducts } from '@/utils/api';
import AnimatedCard from './ui/AnimatedCard';
import AnimatedButton from './ui/AnimatedButton';
import { ProductCardSkeleton } from './ui/SkeletonLoader';
import ScrollReveal from './ScrollReveal';
import StaggerContainer, { StaggerItem } from './StaggerContainer';

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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">

        {/* Title */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-lavender to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" />
            Featured Collection
          </motion.div>
          <h2 className="text-5xl font-bold text-darkblue mb-4">Top Products</h2>
          <p className="text-gray-600 text-lg">Our most popular picks for your hotel</p>
        </ScrollReveal>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product, index) => (
                <StaggerItem key={product.id}>
                  <AnimatedCard delay={index * 0.1} className="group">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {product.sale && (
                        <motion.span
                          className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg z-10"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          Sale
                        </motion.span>
                      )}

                      {product.stock === 0 && (
                        <span className="absolute top-3 right-3 bg-gray-600 text-white px-3 py-1 text-xs font-semibold rounded-full z-10">
                          Sold Out
                        </span>
                      )}

                      <img
                        src={product.image_url || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <p className="text-gray-500 text-xs mb-2 uppercase tracking-wide">
                        {product.brand || 'HOTEL BAZAAR'}
                      </p>

                      <h3 className="font-semibold text-lg text-darkblue mb-2 line-clamp-2 group-hover:text-lavender transition-colors">
                        {product.name}
                      </h3>

                      {/* Price Section */}
                      <div className="flex items-center space-x-2 mb-4">
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ₹{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl font-bold bg-gradient-to-r from-lavender to-purple-600 bg-clip-text text-transparent">
                          ₹{product.price?.toFixed(2) || 'N/A'}
                        </span>
                      </div>

                      {/* Action Button */}
                      {product.stock > 0 ? (
                        <AnimatedButton
                          variant="primary"
                          className="w-full"
                          icon={<ShoppingCart className="w-4 h-4" />}
                          onClick={() => {
                            addToCart(product, 1);
                            showToast('Product added to cart!', 'success');
                          }}
                        >
                          QUICK ADD
                        </AnimatedButton>
                      ) : (
                        <button className="w-full bg-gray-200 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed font-semibold">
                          NOTIFY ME
                        </button>
                      )}
                    </div>
                  </AnimatedCard>
                </StaggerItem>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full py-12">
                No products available.
              </p>
            )}
          </StaggerContainer>
        )}

        {/* CTA */}
        <ScrollReveal className="text-center mt-8">
          <AnimatedButton href="/products" variant="secondary" size="lg">
            View All Products →
          </AnimatedButton>
        </ScrollReveal>

      </div>
    </section>
  );
}
