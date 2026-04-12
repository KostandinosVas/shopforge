import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { products } from '@/db/schema';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { name, slug, description, price, stock, categoryId, images } = await req.json();

  if (!name || !slug || !price) {
    return NextResponse.json({ error: 'Name, slug and price are required' }, { status: 400 });
  }

  await db.insert(products).values({
    name,
    slug,
    description,
    price,
    stock: Number(stock),
    categoryId: categoryId ? Number(categoryId) : null,
    images: images ?? [],
  });

  return NextResponse.json({ success: true });
}