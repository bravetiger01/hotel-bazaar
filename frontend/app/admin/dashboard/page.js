'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Package, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AnimatedModal from '@/components/ui/AnimatedModal';
import ProductForm from '@/components/ProductForm';
import { useToast } from '@/hooks/useToast';
import { createProduct, updateProduct } from '@/utils/api';
import ScrollReveal from '@/components/ScrollReveal';
import StaggerContainer, { StaggerItem } from '@/components/StaggerContainer';
import { ProductCardSkeleton } from '@/components/ui/SkeletonLoader';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { showToast } = useToast();
  const [imageModal, setImageModal] = useState({ open: false, src: '', alt: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products-supabase?limit=100');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products || data);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

const handleDelete = async (productId) => {
  if (!window.confirm('Are you sure you want to delete this product?')) {
    return; 
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/products-supabase/${productId}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }

    setProducts(currentProducts =>
      currentProducts.filter(p => p.id !== productId && p._id !== productId)
    );

    showToast('Product deleted successfully!', 'success');

  } catch (error) {
    console.error('Deletion Error:', error);
    showToast(error.message, 'error'); 
  }
};

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleProductSaved = async (newProduct, isEdit) => {
    showToast('Product saved successfully', 'success');
    setShowModal(false);
    setEditingProduct(null);
    if (isEdit) {
      setProducts(products => products.map(p => p._id === newProduct._id ? newProduct : p));
    } else {
      // Fetch the latest products from the backend
      setLoading(true);
      try {
        const res = await fetch('/api/products-supabase?limit=100');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products || data);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <ScrollReveal direction="left">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your products and inventory</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="right">
            <AnimatedButton 
              onClick={() => setShowModal(true)}
              variant="primary"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Product
            </AnimatedButton>
          </ScrollReveal>
        </div>

        {/* Stats Cards */}
        {!loading && !error && (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StaggerItem>
              <AnimatedCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                </div>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Inventory Value</p>
                    <p className="text-3xl font-bold text-gray-900">₹{totalValue.toFixed(0)}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Low Stock Items</p>
                    <p className="text-3xl font-bold text-gray-900">{lowStockCount}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
              </AnimatedCard>
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-red-50 rounded-xl border border-red-200"
          >
            <p className="text-red-600 text-lg">{error}</p>
          </motion.div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <StaggerItem key={product._id || product.tempKey}>
                <AnimatedCard delay={index * 0.05} className="overflow-hidden group">
                  {/* Product Image */}
                  {product.image && (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                        onClick={() => setImageModal({ open: true, src: product.image, alt: product.name })}
                        whileHover={{ scale: 1.05 }}
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <p className="text-2xl font-bold gradient-text mb-3">
                      ₹{product.price}
                    </p>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Stock Badge */}
                    {product.stock !== undefined && (
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Stock: {product.stock}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        icon={<Edit className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Edit
                      </AnimatedButton>
                      <AnimatedButton
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                        icon={<Trash2 className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Delete
                      </AnimatedButton>
                    </div>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Product Form Modal */}
        <AnimatedModal isOpen={showModal} onClose={handleModalClose} title={editingProduct ? 'Edit Product' : 'Add New Product'} size="lg">
          <ProductForm 
            product={editingProduct} 
            onSave={(product) => handleProductSaved(product, !!editingProduct)}
            onCancel={handleModalClose}
          />
        </AnimatedModal>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {imageModal.open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setImageModal({ open: false, src: '', alt: '' })}
            >
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={imageModal.src}
                alt={imageModal.alt}
                className="max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}