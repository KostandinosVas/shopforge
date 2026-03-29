import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProductCard from '@/components/products/ProductCard/ProductCard';
import styles from './page.module.css';

type Props = {
  searchParams: Promise<{ category?: string }>;
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
          <a
            href="/products"
            className={`${styles.filterBtn} ${!category ? styles.active : ''}`}
          >
            All
          </a>
          {allCategories.map((cat) => (
            <a
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`${styles.filterBtn} ${category === cat.slug ? styles.active : ''}`}
            >
              {cat.name}
            </a>
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
          />
        ))}
      </div>
    </div>
  );
}