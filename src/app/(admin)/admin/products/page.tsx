import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import styles from './page.module.css';

export default async function AdminProductsPage() {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      stock: products.stock,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));

  return (
    <div>
      <div className={styles.top}>
        <h1 className={styles.title}>Products</h1>
        <Link href="/admin/products/new" className={styles.addBtn}>
          + Add Product
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.categoryName ?? '—'}</td>
              <td>€{Number(product.price).toFixed(2)}</td>
              <td>{product.stock}</td>
              <td className={styles.actions}>
                <Link href={`/admin/products/${product.id}/edit`} className={styles.editBtn}>
                  Edit
                </Link>
                <form action={`/api/admin/products/${product.id}/delete`} method="POST">
                  <button type="submit" className={styles.deleteBtn}>Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}