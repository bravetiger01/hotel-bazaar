'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import ProductForm from '@/components/ProductForm';
import { useToast } from '@/hooks/useToast';
import { createProduct, updateProduct } from '@/utils/api';

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
        const res = await fetch('/api/product');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
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
    const token = localStorage.getItem('token'); // or whatever key you use
    const response = await fetch(`/api/product/${productId}`, { 
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
      currentProducts.filter(p => p._id !== productId)
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
        const res = await fetch('/api/product');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setShowModal(true)}>
          Add New Product
        </Button>
      </div>

      {loading && <div className="text-center py-12">Loading products...</div>}
      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id || product.tempKey} className="p-6">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4 cursor-pointer"
                  onClick={() => setImageModal({ open: true, src: product.image, alt: product.name })}
                />
              )}
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-lavender font-bold mb-2">Rs. {product.price}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={handleModalClose}>
        <ProductForm 
          product={editingProduct} 
          onSave={(product) => handleProductSaved(product, !!editingProduct)}
          onCancel={handleModalClose}
        />
      </Modal>
      {imageModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setImageModal({ open: false, src: '', alt: '' })}>
          <img src={imageModal.src} alt={imageModal.alt} className="max-w-3xl max-h-[90vh] rounded shadow-lg border-4 border-white" />
        </div>
      )}
    </div>
  );
}