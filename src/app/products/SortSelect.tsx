'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') ?? 'newest';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  }

  return (
    <select className={styles.sortSelect} value={sort} onChange={handleChange}>
      <option value="newest">Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}