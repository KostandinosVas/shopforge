import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ProductForm from '../../ProductForm';

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const allCategories = await db.select().from(categories);
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, Number(id)));

  if (!product) notFound();

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '2rem' }}>
        Edit Product
      </h1>
      <ProductForm categories={allCategories} product={product} />
    </div>
  );
}