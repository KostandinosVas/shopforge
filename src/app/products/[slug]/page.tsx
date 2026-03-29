import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import styles from './page.module.css';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) notFound();

  return (
    <div className={styles.container}>
      <div className={styles.imagePlaceholder}>No image yet</div>

      <div className={styles.info}>
        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.price}>€{Number(product.price).toFixed(2)}</p>
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
        <p className={styles.stock}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}