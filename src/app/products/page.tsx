import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, gte, lte, and, asc, desc, sql } from 'drizzle-orm';
import ProductSidebar from './ProductSidebar';
import ProductGrid from './ProductGrid';
import SortSelect from './SortSelect';
import styles from './page.module.css';

export const metadata = {
  title: 'Shop',
  description: 'Browse our full collection of products.',
};

const PER_PAGE = 8;

type Props = {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category, minPrice, maxPrice, sort } = await searchParams;

  const allCategories = await db.select().from(categories);
  const categoryId = allCategories.find((c) => c.slug === category)?.id;

  const filters = [];
  if (categoryId) filters.push(eq(products.categoryId, categoryId));
  if (minPrice) filters.push(gte(products.price, minPrice));
  if (maxPrice) filters.push(lte(products.price, maxPrice));

  const where = filters.length > 0 ? and(...filters) : undefined;

  const orderBy =
    sort === 'price_asc' ? asc(products.price) :
    sort === 'price_desc' ? desc(products.price) :
    desc(products.createdAt);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(where);

  const initialProducts = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(orderBy)
    .limit(PER_PAGE)
    .offset(0);

  const hasMore = initialProducts.length === PER_PAGE && Number(count) > PER_PAGE;

  return (
    <div className={styles.layout}>
      <ProductSidebar
        categories={allCategories}
        activeCategory={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
      />

      <div className={styles.main}>
        <div className={styles.topBar}>
          <p className={styles.resultCount}>{count} products</p>
          <SortSelect sort={sort} />
        </div>

        {initialProducts.length === 0 ? (
          <p className={styles.empty}>No products found.</p>
        ) : (
          <ProductGrid
            key={`${category}-${minPrice}-${maxPrice}-${sort}`}
            initialProducts={initialProducts}
            initialHasMore={hasMore}
          />
        )}
      </div>
    </div>
  );
}