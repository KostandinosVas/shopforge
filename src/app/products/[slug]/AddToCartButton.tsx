'use client';

import { useCartStore } from '@/store/cart';
import styles from './page.module.css';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  stock: number;
  images: string[];
};

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] ?? '',
    });
  }

  return (
    <button
      className={styles.addBtn}
      onClick={handleAdd}
      disabled={product.stock === 0}
    >
      {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
    </button>
  );
}