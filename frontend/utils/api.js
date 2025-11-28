const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get auth headers
const getAuthHeaders = (isMultipart = false) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (isMultipart) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Products API
export const getAllProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/product`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const createProduct = async (productData, isMultipart = false) => {
  const response = await fetch(`${API_BASE_URL}/product`, {
    method: 'POST',
    headers: getAuthHeaders(isMultipart),
    body: isMultipart ? productData : JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async (id, productData, isMultipart = false) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(isMultipart),
    body: isMultipart ? productData : JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return response.json();
};

// Admin API
export const loginAdmin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

// User Profile API
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

export const updateUserPassword = async (passwordData) => {
  const response = await fetch(`${API_BASE_URL}/user/profile/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });
  if (!response.ok) throw new Error('Failed to update password');
  return response.json();
};

// Orders API
export const getUserOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/order`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const placeOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/order`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to place order');
  return response.json();
};

export const requestOrderOTP = async () => {
  const response = await fetch(`${API_BASE_URL}/order/request-otp`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to request OTP');
  return response.json();
};
