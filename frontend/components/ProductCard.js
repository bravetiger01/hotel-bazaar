'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedCard from './ui/AnimatedCard';
import AnimatedButton from './ui/AnimatedButton';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product, index = 0 }) {
  const productId = product.id || product._id;
  const imageUrl = product.image_url || product.image || '/api/placeholder/300/300';
  
  return (
    <AnimatedCard delay={index * 0.1} className="group glass-card overflow-hidden blue-glow-hover transition-all duration-300">
      <Link href={`/products/${productId}`}>
        <div className="relative aspect-square overflow-hidden bg-black/50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex gap-2"
            >
              <motion.a
                href={`/products/${productId}`}
                className="glass text-blue-400 p-2 rounded-full shadow-lg border border-blue-500/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Badge for new/sale items */}
          {product.isNew && (
            <motion.div
              className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              NEW
            </motion.div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/products/${productId}`}>
          <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <div>
            <span className="text-2xl font-bold gradient-text">
              ₹{product.price}
            </span>
          </div>
          <AnimatedButton href={`/products/${productId}`} size="sm" variant="primary">
            View
          </AnimatedButton>
        </div>
      </div>
    </AnimatedCard>
  );
}