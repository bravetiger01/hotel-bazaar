'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import { createProduct, updateProduct } from '@/utils/api';
import { useToast } from '@/hooks/useToast';

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '', // will be used for preview
    category: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        image: product.image || '',
        category: product.category || '',
        stock: product.stock || '',
      });
      setImageFile(null);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      if (imageFile) {
        data.append('image', imageFile);
      }
      if (product) {
        const updated = await updateProduct(product._id, data, true);
        //showToast('Product updated successfully', 'success');
        onSave(updated, true); // Pass updated product and isEdit=true
      } else {
        const created = await createProduct(data, true);
       // showToast('Product created successfully', 'success');
        onSave(created, false); // Pass new product and isEdit=false
      }
    } catch (err) {
      showToast('Failed to save product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
            required
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium mb-1">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
  id="category"
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
  required
>
  <option value="" disabled>Select a Category</option>
  <option value="Bathroom Cleaners">Bathroom Cleaners</option>
  <option value="Glass & Surface">Glass & Surface</option>
  <option value="Personal Care">Personal Care</option>
</select>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1">
          Product Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
        />
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded border"
          />
        )}
      </div>

      <div className="flex space-x-4 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}