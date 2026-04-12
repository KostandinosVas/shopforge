import { db } from '@/db';
import { categories } from '@/db/schema';
import ProductSidebar from './ProductSidebar';
import ProductGrid from './ProductGrid';
import SortSelect from './SortSelect';
import { Suspense } from 'react';
import styles from './page.module.css';

export const metadata = {
  title: 'Shop',
  description: 'Browse our full collection of products.',
};

export default async function ProductsPage() {
  const allCategories = await db.select().from(categories);

  return (
    <div className={styles.layout}>
      <Suspense fallback={<div className={styles.sidebar} />}>
        <ProductSidebar categories={allCategories} />
      </Suspense>

      <div className={styles.main}>
        <div className={styles.topBar}>
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>

        <Suspense fallback={<p style={{ color: '#888' }}>Loading products...</p>}>
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}