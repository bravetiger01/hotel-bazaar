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
  const response = await fetch(`/api/product`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`/api/product/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const createProduct = async (productData, isMultipart = false) => {
  const response = await fetch(`/api/product`, {
    method: 'POST',
    headers: getAuthHeaders(isMultipart),
    body: isMultipart ? productData : JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async (id, productData, isMultipart = false) => {
  const response = await fetch(`/api/product/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(isMultipart),
    body: isMultipart ? productData : JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`/api/product/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return response.json();
};

// User API
export const signupUser = async (userData) => {
  const response = await fetch(`/api/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Signup failed');
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`/api/user/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Logout failed');
  return response.json();
};

export const verifyEmail = async (token) => {
  const response = await fetch(`/api/user/verify-email?token=${token}`);
  if (!response.ok) throw new Error('Email verification failed');
  return response.json();
};

export const resendVerificationEmail = async (email) => {
  const response = await fetch(`/api/user/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error('Failed to resend verification email');
  return response.json();
};

export const setupPassword = async (passwordData, tempToken) => {
  const response = await fetch(`/api/user/setup-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tempToken}`,
    },
    body: JSON.stringify(passwordData),
  });
  if (!response.ok) throw new Error('Failed to setup password');
  return response.json();
};

// User Profile API
export const getUserProfile = async () => {
  const response = await fetch(`/api/user/profile`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`/api/user/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

export const updateUserPassword = async (passwordData) => {
  const response = await fetch(`/api/user/profile/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });
  if (!response.ok) throw new Error('Failed to update password');
  return response.json();
};

// Orders API
export const getUserOrders = async () => {
  const response = await fetch(`/api/order`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const placeOrder = async (orderData) => {
  const response = await fetch(`/api/order`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to place order');
  return response.json();
};

export const requestOrderOTP = async () => {
  const response = await fetch(`/api/order/request-otp`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to request OTP');
  return response.json();
};

export const deleteOrder = async (orderId) => {
  const response = await fetch(`/api/order?orderId=${orderId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete order');
  return response.json();
};
