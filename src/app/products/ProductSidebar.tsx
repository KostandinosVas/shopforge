'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

type Category = { id: number; name: string; slug: string };

type Props = {
  categories: Category[];
  activeCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

export default function ProductSidebar({ categories, activeCategory, minPrice, maxPrice }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  }

  function handlePriceSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const min = (form.elements.namedItem('minPrice') as HTMLInputElement).value;
    const max = (form.elements.namedItem('maxPrice') as HTMLInputElement).value;
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min); else params.delete('minPrice');
    if (max) params.set('maxPrice', max); else params.delete('maxPrice');
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  }

  function clearAll() {
    router.push('/products');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>Categories</h3>
        <ul className={styles.categoryList}>
          <li>
            <button
              className={`${styles.categoryBtn} ${!activeCategory ? styles.categoryActive : ''}`}
              onClick={() => updateParam('category', undefined)}
            >
              All
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                className={`${styles.categoryBtn} ${activeCategory === cat.slug ? styles.categoryActive : ''}`}
                onClick={() => updateParam('category', cat.slug)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarTitle}>Price Range</h3>
        <form className={styles.priceForm} onSubmit={handlePriceSubmit}>
          <div className={styles.priceInputs}>
            <input
              name="minPrice"
              type="number"
              placeholder="Min"
              defaultValue={minPrice}
              min="0"
              className={styles.priceInput}
            />
            <span>—</span>
            <input
              name="maxPrice"
              type="number"
              placeholder="Max"
              defaultValue={maxPrice}
              min="0"
              className={styles.priceInput}
            />
          </div>
          <button type="submit" className={styles.applyBtn}>Apply</button>
        </form>
      </div>

      <button className={styles.clearBtn} onClick={clearAll}>Clear all filters</button>
    </aside>
  );
}