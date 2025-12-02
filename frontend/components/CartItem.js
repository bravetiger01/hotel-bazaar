"use client";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product;
  const id = product.id || product._id;

  return (
    <div className="flex items-center glass-card p-4 border-b border-white/10">
      {/* Product Image */}
      <div className="w-24 h-24 relative flex-shrink-0">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-white">{product.name}</h3>
        <p className="text-blue-400 text-sm font-semibold">₹{product.price}</p>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 mt-2">
          <a
            className={`px-3 py-1 bg-white/5 border border-white/10 rounded-lg cursor-pointer text-white hover:bg-white/10 transition ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => item.quantity > 1 && updateQuantity(id, item.quantity - 1)}
          >
            -
          </a>

          <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-lg text-white">
            {item.quantity}
          </span>

          <a
            className={`px-3 py-1 bg-white/5 border border-white/10 rounded-lg cursor-pointer text-white hover:bg-white/10 transition ${item.quantity >= (product.stock || 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => item.quantity < (product.stock || 0) && updateQuantity(id, item.quantity + 1)}
          >
            +
          </a>
        </div>

        {/* Stock Info */}
        <p className="text-xs text-gray-400 mt-1">
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p>
      </div>

      {/* Remove Button */}
      <a
        className="ml-4 text-red-400 hover:text-red-300 cursor-pointer text-xl flex-shrink-0"
        onClick={() => removeFromCart(id)}
      >
        ✕
      </a>
    </div>
  );
}
