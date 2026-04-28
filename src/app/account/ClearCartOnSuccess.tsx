'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cart';

export default function ClearCartOnSuccess() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (searchParams.get('order') === 'success') {
      clearCart();
    }
  }, [searchParams, clearCart]);

  return null;
}
