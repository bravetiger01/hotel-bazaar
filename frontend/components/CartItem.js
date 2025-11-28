'use client';

import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import Button from './Button';
import { useCart } from '@/hooks/useCart';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const stock = item.product.stock || 0;
  const isAtMaxStock = item.quantity >= stock;

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.product.image || '/api/placeholder/80/80'}
          alt={item.product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{item.product.name}</h3>
        <p className="text-lavender font-bold">Rs. {item.product.price}</p>
        {stock > 0 && (
          <p className="text-xs text-gray-500">Stock: {stock}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
          disabled={isAtMaxStock}
          title={isAtMaxStock ? 'Maximum stock reached' : ''}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-right">
        <p className="font-bold">Rs. {(item.product.price * item.quantity).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeFromCart(item.product._id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}