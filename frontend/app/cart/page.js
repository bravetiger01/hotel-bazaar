'use client';

import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/CartItem';
import Button from '@/components/Button';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';

export default function CartPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    console.log('CartPage localStorage:', savedCart);
  }, []);

  if (items.length === 0) {
    return (
    <>  
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty</p>
        <Button href="/products">Continue Shopping</Button>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Order Placed!">
        <div className="text-center">
          <div className="text-3xl mb-4">🎉</div>
          <div className="text-lg font-semibold mb-2">Your order has been placed!</div>
          <div className="text-gray-600 mb-4">We will soon contact you regarding your order.</div>
          <Button className="w-full" onClick={() => setShowModal(false)}>Close</Button>
        </div>
      </Modal>
    </>
    );
  }

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders-supabase/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      setOtpRequested(true);
      setError("");
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Place order with OTP
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders-supabase/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          products: items.map(item => ({
            _id: item.product.id || item.product._id,
            id: item.product.id || item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
          })),
          total: getTotalPrice(),
          otp: otp.trim(),
        }),
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }
      
      console.log('Order placed successfully:', data);
      console.log('Setting showModal to true');
      setShowModal(true);
      clearCart();
      setOtp("");
      setOtpRequested(false);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={`${item.product._id}-${item.selectedOptions}`} item={item} />
            ))}
          </div>
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>Rs. {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            {!otpRequested ? (
              <Button className="w-full mb-4" onClick={handleRequestOtp} loading={loading} disabled={loading}>
                Proceed to Checkout
              </Button>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Order OTP</label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter OTP sent to your email"
                    autoComplete="one-time-code"
                  />
                </div>
                <Button className="w-full mb-4" onClick={handlePlaceOrder} loading={loading} disabled={loading || !otp.trim()}>
                  Place Order
                </Button>
              </>
            )}
            <Button variant="outline" onClick={clearCart} className="w-full">
              Clear Cart
            </Button>
            {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
}