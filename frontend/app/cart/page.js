'use client';

import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/CartItem';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedModal from '@/components/ui/AnimatedModal';
import { useEffect, useState } from 'react';
import { ShoppingBag, Trash2, CheckCircle } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import StaggerContainer, { StaggerItem } from '@/components/StaggerContainer';

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-20">
        <ScrollReveal direction="up">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-lavender/20 to-purple-100 flex items-center justify-center"
            >
              <ShoppingBag className="w-16 h-16 text-lavender" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">Your Cart</h1>
            <p className="text-gray-600 text-lg mb-8">Your cart is empty. Start shopping now!</p>
            <AnimatedButton href="/products" variant="primary" size="lg">
              Continue Shopping
            </AnimatedButton>
          </div>
        </ScrollReveal>
      </div>
      <AnimatedModal isOpen={showModal} onClose={() => setShowModal(false)} title="Order Placed!">
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-3">Order Placed Successfully!</h3>
          <p className="text-gray-600 mb-6">We will contact you soon regarding your order.</p>
          <AnimatedButton className="w-full" onClick={() => setShowModal(false)} variant="primary">
            Close
          </AnimatedButton>
        </div>
      </AnimatedModal>
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container">
          <ScrollReveal direction="up">
            <h1 className="text-5xl font-bold mb-2 gradient-text">Your Cart</h1>
            <p className="text-gray-600 mb-8">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <StaggerContainer className="space-y-4">
                {items.map((item) => (
                  <StaggerItem key={`${item.product._id}-${item.selectedOptions}`}>
                    <CartItem item={item} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Order Summary */}
            <ScrollReveal direction="right" delay={0.2}>
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-24 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total:</span>
                    <span className="gradient-text">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                {!otpRequested ? (
                  <AnimatedButton 
                    className="w-full mb-4" 
                    onClick={handleRequestOtp} 
                    loading={loading} 
                    disabled={loading}
                    variant="primary"
                    size="lg"
                  >
                    Proceed to Checkout
                  </AnimatedButton>
                ) : (
                  <>
                    <div className="mb-4">
                      <label htmlFor="otp" className="block text-sm font-semibold text-gray-900 mb-2">
                        Order OTP
                      </label>
                      <motion.input
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent transition-all"
                        placeholder="Enter OTP sent to your email"
                        autoComplete="one-time-code"
                      />
                    </div>
                    <AnimatedButton 
                      className="w-full mb-4" 
                      onClick={handlePlaceOrder} 
                      loading={loading} 
                      disabled={loading || !otp.trim()}
                      variant="primary"
                      size="lg"
                    >
                      Place Order
                    </AnimatedButton>
                  </>
                )}

                <AnimatedButton 
                  variant="outline" 
                  onClick={clearCart} 
                  className="w-full"
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Clear Cart
                </AnimatedButton>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </>
  );
}