'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import styles from './Header.module.css';

export default function CartIcon() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link href="/cart" className={styles.cartButton}>
      🛒
      {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
    </Link>
  );
}