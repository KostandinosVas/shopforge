'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { useCartStore } from '@/store/cart';

type Props = {
  id: number;
  name: string;
  slug: string;
  price: string;
  image?: string;
  category?: string;
};

export default function ProductCard({ id, name, slug, price, image, category }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ id, name, price: Number(price), image: image ?? '' });
  }

  return (
    <Link href={`/products/${slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {image ? (
          <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className={styles.imagePlaceholder}>No image</div>
        )}
        {category && <span className={styles.badge}>{category}</span>}
        <button className={styles.quickAdd} onClick={handleQuickAdd}>
          + Add to Cart
        </button>
      </div>
      <div className={styles.info}>
        {category && <span className={styles.category}>{category}</span>}
        <p className={styles.name}>{name}</p>
        <p className={styles.price}>€{Number(price).toFixed(2)}</p>
      </div>
    </Link>
  );
}