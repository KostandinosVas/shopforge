'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard/ProductCard';
import styles from './page.module.css';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: string[];
};

type Props = {
  initialProducts: Product[];
  initialHasMore: boolean;
};

export default function ProductGrid({ initialProducts, initialHasMore }: Props) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    setItems((prev) => [...prev, ...data.products]);
    setHasMore(data.hasMore);
    setPage((p) => p + 1);
    loadingRef.current = false;
    setLoading(false);
  }, [hasMore, page, searchParams]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadMore();
        }
      },
      { rootMargin: '300px', threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className={styles.grid}>
        {items.map((product) => (
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

      <div ref={sentinelRef} className={styles.sentinel}>
        {loading && <p className={styles.loadingText}>Loading...</p>}
        {!hasMore && items.length > 0 && (
          <p className={styles.endText}>All products loaded</p>
        )}
      </div>
    </>
  );
}