'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import styles from './Header.module.css';

export default function Header() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          ShopForge
        </Link>

        <nav>
          <ul className={styles.nav}>
            <li><Link href="/products">Shop</Link></li>
          </ul>
        </nav>

        <Link href="/cart" className={styles.cartButton}>
          🛒
          {totalItems > 0 && (
            <span className={styles.cartCount}>{totalItems}</span>
          )}
        </Link>
      </div>
    </header>
  );
}