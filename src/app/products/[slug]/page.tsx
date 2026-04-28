import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import styles from './page.module.css';
import Image from 'next/image';
import { reviews as reviewsTable, users } from '@/db/schema';
import { auth } from '@/lib/auth';
import Reviews from '@/components/products/Reviews/Reviews';

type Props = {
  params: Promise<{ slug: string }>;
};


export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) return { title: 'Product not found' };

  return {
    title: `${product.name} — ShopForge`,
    description: product.description ?? `Buy ${product.name} at ShopForge.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) notFound();

  

  const session = await auth();

  const productReviews = await db
    .select({
      id: reviewsTable.id,
      rating: reviewsTable.rating,
      comment: reviewsTable.comment,
      createdAt: reviewsTable.createdAt,
      userName: users.name,
    })
    .from(reviewsTable)
    .leftJoin(users, eq(users.id, reviewsTable.userId))
    .where(eq(reviewsTable.productId, product.id))
    .orderBy(desc(reviewsTable.createdAt));

  const hasReviewed = session
    ? productReviews.some((r) => r.userName === session.user?.name)
    : false;





  return (
    <>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          ) : (
            <div className={styles.imagePlaceholder}>No image yet</div>
          )}
        </div>

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

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}>
        <Reviews
          productId={product.id}
          initialReviews={productReviews}
          isLoggedIn={!!session}
          hasReviewed={hasReviewed}
        />
      </div>
    </>
  );
}