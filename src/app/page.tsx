import { db } from '@/db';
import { products, categories } from '@/db/schema';
import ProductCard from '@/components/products/ProductCard/ProductCard';
import styles from './page.module.css';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';

const CATEGORY_EMOJIS: Record<string, string> = {
  clothing: '👕',
  accessories: '👜',
  footwear: '👟',
  electronics: '💻',
  'home-living': '🏠',
  sports: '⚽',
  books: '📚',
  'beauty-skincare': '✨',
};

export default async function Home() {
  const [featured, allCategories] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        images: products.images,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .orderBy(desc(products.createdAt))
      .limit(4),
    db.select().from(categories),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>New arrivals every week</p>
        <h1>Shop the best.<br />Skip the rest.</h1>
        <p className={styles.heroSub}>Quality products across fashion, tech, home and more — delivered fast.</p>
        <div className={styles.heroActions}>
          <Link href="/products" className={styles.heroCta}>Shop Now</Link>
          <Link href="/products?sort=price_asc" className={styles.heroSecondary}>View Deals</Link>
        </div>
      </section>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <strong>🚚 Free Shipping</strong>
            <p>On orders over €50</p>
          </div>
          <div className={styles.trustItem}>
            <strong>↩️ Easy Returns</strong>
            <p>30-day return policy</p>
          </div>
          <div className={styles.trustItem}>
            <strong>🔒 Secure Checkout</strong>
            <p>Powered by Stripe</p>
          </div>
          <div className={styles.trustItem}>
            <strong>⭐ Top Rated</strong>
            <p>Thousands of happy customers</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <h2>Shop by Category</h2>
          <Link href="/products" className={styles.viewAll}>View all →</Link>
        </div>
        <div className={styles.categoriesGrid}>
          {allCategories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className={styles.categoryCard}>
              <div className={styles.categoryEmoji}>{CATEGORY_EMOJIS[cat.slug] ?? '🛍️'}</div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Featured Products</h2>
          <Link href="/products" className={styles.viewAll}>Shop all →</Link>
        </div>
        <div className={styles.grid}>
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              image={product.images?.[0]}
              category={product.categoryName ?? undefined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}