'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Eye, EyeOff, Lock, Package, User, Mail, Phone, MapPin, Save, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || ''
        });
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Error loading profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/order`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditing(false);
        showToast('Profile updated successfully', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    }
  };

  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/user/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        showToast('Password updated successfully', 'success');
        setShowPasswordReset(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to update password', 'error');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Error updating password', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lavender"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-lavender rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-darkblue">{user?.name}</h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-lavender text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-darkblue mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-center space-x-4">
                    <User className="w-5 h-5 text-lavender" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.name || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-lavender" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-lavender" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {editing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-lavender mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      {editing ? (
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
                          rows="3"
                          placeholder="Enter your address"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.address || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Actions */}
                {editing && (
                  <div className="flex space-x-4 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-lavender text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security & Actions */}
            <div className="space-y-6">
              {/* Security Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-darkblue mb-4">Security</h3>
                
                {/* Hidden Password Reset Button */}
                <div className="relative group">
                  <button
                    onClick={() => setShowPasswordReset(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors opacity-50 hover:opacity-100"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Reset Password</span>
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Click to reset your password
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-darkblue mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Verified</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user?.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user?.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div> 
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-darkblue flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Recent Orders</span>
                </h2>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-darkblue">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                          <p className="text-sm text-gray-600">
                            {order.products?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lavender">
                            ₹{order.products?.reduce((total, product) => total + (product.price * product.quantity), 0) || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-darkblue">Reset Password</h3>
              <button
                onClick={() => setShowPasswordReset(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Password Requirements:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Minimum 6 characters</li>
                      <li>• Cannot be the same as current password</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handlePasswordReset}
                  className="flex-1 bg-lavender text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowPasswordReset(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 