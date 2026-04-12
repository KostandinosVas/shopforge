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

export default function ProductGrid() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const paramsKey = searchParams.toString();

  // Reset when filters change
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    setPage(1);
    setCount(null);
  }, [paramsKey]);

  const loadMore = useCallback(async (currentPage: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(currentPage));

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    setItems((prev) => currentPage === 1 ? data.products : [...prev, ...data.products]);
    setHasMore(data.hasMore);
    if (data.count !== undefined) setCount(data.count);
    setPage(currentPage + 1);
    loadingRef.current = false;
    setLoading(false);
  }, [searchParams]);

  // Load first page when params change
  useEffect(() => {
    loadMore(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && hasMore) {
          loadMore(page);
        }
      },
      { rootMargin: '300px', threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, page]);

  return (
    <>
      {count !== null && (
        <p className={styles.resultCount}>{count} products</p>
      )}
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