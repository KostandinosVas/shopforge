import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, gte, lte, and, asc, desc } from 'drizzle-orm';

const PER_PAGE = 8;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const offset = (page - 1) * PER_PAGE;

  const { categories } = await import('@/db/schema');
  const { db: dbClient } = await import('@/db');

  const allCategories = await dbClient.select().from(categories);
  const categoryId = allCategories.find((c) => c.slug === category)?.id;

  const filters = [];
  if (categoryId) filters.push(eq(products.categoryId, categoryId));
  if (minPrice) filters.push(gte(products.price, minPrice));
  if (maxPrice) filters.push(lte(products.price, maxPrice));

  const where = filters.length > 0 ? and(...filters) : undefined;

  const orderBy =
    sort === 'price_asc' ? asc(products.price) :
    sort === 'price_desc' ? desc(products.price) :
    desc(products.createdAt);

  const results = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(orderBy)
    .limit(PER_PAGE)
    .offset(offset);

  return NextResponse.json({
    products: results,
    hasMore: results.length === PER_PAGE,
  });
}