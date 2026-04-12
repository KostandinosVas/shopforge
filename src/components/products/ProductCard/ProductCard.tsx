import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';

type Props = {
  id: number;
  name: string;
  slug: string;
  price: string;
  image?: string;
};

export default function ProductCard({ name, slug, price, image }: Props) {
  return (
    <Link href={`/products/${slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {image ? (
          <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className={styles.imagePlaceholder}>No image</div>
        )}
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.price}>€{Number(price).toFixed(2)}</p>
      </div>
    </Link>
  );
}