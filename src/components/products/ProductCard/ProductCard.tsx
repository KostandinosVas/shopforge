import Link from 'next/link';
import styles from './ProductCard.module.css';

type Props = {
  id: number;
  name: string;
  slug: string;
  price: string;
};

export default function ProductCard({ name, slug, price }: Props) {
  return (
    <Link href={`/products/${slug}`} className={styles.card}>
      <div className={styles.imagePlaceholder}>No image yet</div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.price}>€{Number(price).toFixed(2)}</p>
      </div>
    </Link>
  );
}