'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getProductById } from '@/utils/api';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

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

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  const handleAddToCart = () => {
    const maxStock = product.stock || 0;
    if (quantity > maxStock) {
      showToast(`Only ${maxStock} items available in stock`, 'error');
      return;
    }
    addToCart(product, quantity);
    showToast('Product added to cart!', 'success');
  };

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* FIXED IMAGE SECTION */}
        <div className="relative aspect-square">
          <Image
            src={product.image_url || '/placeholder.png'}  // 👉 MUST USE `image_url`
            alt={product.name || 'Product Image'}
            fill
            className="object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/placeholder.png'; // fallback image
            }}
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-lavender">Rs. {product.price}</p>

          {/* Stock Indicator */}
          {product.stock !== undefined && (
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 10 ? 'bg-green-100 text-green-800' :
              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          )}

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label className="font-medium">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-lavender"
              disabled={!product.stock}
            >
              {[...Array(Math.min(10, product.stock || 0))].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={!product.stock}
          >
            {product.stock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}
