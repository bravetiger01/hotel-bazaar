'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Package, Truck, Shield, Minus, Plus, ArrowLeft } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { getProductById } from '@/utils/api';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <PageLoader />;
  if (!product) return (
    <div className="container py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h2>
        <AnimatedButton href="/products" variant="primary">
          Back to Products
        </AnimatedButton>
      </motion.div>
    </div>
  );

  const handleAddToCart = () => {
    const maxStock = product.stock || 0;
    if (quantity > maxStock) {
      showToast(`Only ${maxStock} items available in stock`, 'error');
      return;
    }
    addToCart(product, quantity);
    showToast('Product added to cart!', 'success');
  };

  const incrementQuantity = () => {
    if (quantity < Math.min(10, product.stock || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-lavender transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <ScrollReveal direction="left">
            <motion.div 
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={product.image_url || '/placeholder.png'}
                alt={product.name || 'Product Image'}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </ScrollReveal>

          {/* Product Info Section */}
          <ScrollReveal direction="right">
            <div className="space-y-6">
              {/* Product Name */}
              <motion.h1 
                className="text-5xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product.name}
              </motion.h1>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-4xl font-bold bg-gradient-to-r from-lavender to-purple-600 bg-clip-text text-transparent">
                  ₹{product.price}
                </span>
              </motion.div>

              {/* Stock Badge */}
              {product.stock !== undefined && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </motion.div>
              )}

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="prose prose-lg"
              >
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </motion.div>

              {/* Quantity Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <label className="text-lg font-semibold text-gray-900">Quantity:</label>
                <div className="flex items-center gap-4">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={decrementQuantity}
                    className={`w-12 h-12 rounded-full bg-gray-200 hover:bg-lavender hover:text-white transition-colors flex items-center justify-center ${(quantity <= 1 || !product.stock) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Minus className="w-5 h-5" />
                  </motion.a>
                  
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {quantity}
                  </span>
                  
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={incrementQuantity}
                    className={`w-12 h-12 rounded-full bg-gray-200 hover:bg-lavender hover:text-white transition-colors flex items-center justify-center ${(quantity >= Math.min(10, product.stock || 0) || !product.stock) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Add to Cart Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <AnimatedButton
                  onClick={handleAddToCart}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!product.stock}
                  icon={<ShoppingCart className="w-5 h-5" />}
                >
                  {product.stock ? 'Add to Cart' : 'Out of Stock'}
                </AnimatedButton>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lavender/10 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-lavender" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over ₹500</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lavender/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-lavender" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% secure</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lavender/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-lavender" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Quality Product</p>
                    <p className="text-xs text-gray-500">Premium quality</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
