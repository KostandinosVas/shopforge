import { db } from '@/db';
import { categories } from '@/db/schema';
import ProductForm from '../ProductForm';

export default async function NewProductPage() {
  const allCategories = await db.select().from(categories);
  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '2rem' }}>
        Add Product
      </h1>
      <ProductForm categories={allCategories} />
    </div>
  );
}