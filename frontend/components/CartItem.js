"use client";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product;
  const id = product.id || product._id;

  return (
    <div className="flex items-center border-b py-4">
      {/* Product Image */}
      <div className="w-24 h-24 relative">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 ml-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-600 text-sm">₹{product.price}</p>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 mt-2">
          <a
            className={`px-2 py-1 bg-gray-200 rounded cursor-pointer ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => item.quantity > 1 && updateQuantity(id, item.quantity - 1)}
          >
            -
          </a>

          <span className="px-3 py-1 border rounded">
            {item.quantity}
          </span>

          <a
            className={`px-2 py-1 bg-gray-200 rounded cursor-pointer ${item.quantity >= (product.stock || 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => item.quantity < (product.stock || 0) && updateQuantity(id, item.quantity + 1)}
          >
            +
          </a>
        </div>

        {/* Stock Info */}
        <p className="text-xs text-gray-500 mt-1">
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p>
      </div>

      {/* Remove Button */}
      <a
        className="ml-4 text-red-500 hover:text-red-700 cursor-pointer"
        onClick={() => removeFromCart(id)}
      >
        ✕
      </a>
    </div>
  );
}
