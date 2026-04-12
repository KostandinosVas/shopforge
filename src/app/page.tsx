import { db } from '@/db';
import { products } from '@/db/schema';
import ProductCard from '@/components/products/ProductCard/ProductCard';
import styles from './page.module.css';

export default async function Home() {
  const featured = await db.select().from(products).limit(4);

  return (
    <div>
      <section className={styles.hero}>
        <h1>Welcome to ShopForge</h1>
        <p>Quality products, delivered fast.</p>
      </section>

      <section className={styles.section}>
        <h2>Featured Products</h2>
        <div className={styles.grid}>
          {featured.map((product) => (
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
      </section>
    </div>
  );
}