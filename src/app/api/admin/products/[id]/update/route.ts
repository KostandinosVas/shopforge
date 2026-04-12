import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { name, slug, description, price, stock, categoryId, images } = await req.json();

  await db
    .update(products)
    .set({
      name,
      slug,
      description,
      price,
      stock: Number(stock),
      categoryId: categoryId ? Number(categoryId) : null,
      images: images ?? [],
    })
    .where(eq(products.id, Number(id)));

  return NextResponse.json({ success: true });
}