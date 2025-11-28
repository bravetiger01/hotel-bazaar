"use client";
import Hero from '@/components/Hero';
import ProductCategories from '@/components/ProductCategories';
import ClearanceSale from '@/components/ClearanceSale';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const CompleteProfileModal = dynamic(() => import('@/components/CompleteProfileModal'), { ssr: false });

export default function HomePage() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ email: '', tempToken: '' });
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const tempToken = params.get('temp_token');
    if (email && tempToken) {
      setModalData({ email, tempToken });
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    // Remove query params from URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('email');
      url.searchParams.delete('temp_token');
      window.history.replaceState({}, document.title, url.pathname);
    }
  };

  return (
    <div>
      {showModal && <CompleteProfileModal email={modalData.email} tempToken={modalData.tempToken} onClose={handleCloseModal} />}
      <Hero />
      <ProductCategories />
      <ClearanceSale />
    </div>
  );
}