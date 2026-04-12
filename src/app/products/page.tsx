import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProductCard from '@/components/products/ProductCard/ProductCard';
import styles from './page.module.css';
import Link from 'next/dist/client/link';

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export const metadata = {
  title: 'Shop',
  description: 'Browse our full collection of products.',
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const allCategories = await db.select().from(categories);

  const allProducts = category
    ? await db
        .select()
        .from(products)
        .where(
          eq(
            products.categoryId,
            allCategories.find((c) => c.slug === category)?.id ?? -1
          )
        )
    : await db.select().from(products);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h1 className={styles.title}>All Products</h1>
        <div className={styles.filters}>
          <Link
            href="/products"
            className={`${styles.filterBtn} ${!category ? styles.active : ''}`}
          >
            All
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`${styles.filterBtn} ${category === cat.slug ? styles.active : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={product.images?.[0]}
              />
        ))}
      </div>
    </div>
  );
}