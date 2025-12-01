import Image from 'next/image';
import Link from 'next/link';
import Card from './Card';
import Button from './Button';

export default function ProductCard({ product }) {
  const productId = product.id || product._id; // Support both Supabase (id) and MongoDB (_id)
  const imageUrl = product.image_url || product.image || '/api/placeholder/300/300';
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${productId}`}>
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${productId}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-lavender transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-lavender">Rs. {product.price}</span>
          <Button href={`/products/${productId}`} size="sm">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}