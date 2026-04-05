'use client';

import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Something went wrong');
      setLoading(false);
      return;
    }

    clearCart();
    router.push(data.url);
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Your Cart</h1>
        <p className={styles.empty}>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Cart</h1>

      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.imagePlaceholder}>img</div>

          <div className={styles.itemInfo}>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemPrice}>€{item.price.toFixed(2)}</p>
          </div>

          <div className={styles.qtyControls}>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
            Remove
          </button>
        </div>
      ))}

      <div className={styles.summary}>
        <p className={styles.total}>Total: €{total.toFixed(2)}</p>
        <button className={styles.checkoutBtn} onClick={handleCheckout} disabled={loading}>
          {loading ? 'Redirecting...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}