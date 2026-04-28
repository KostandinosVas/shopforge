import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, gte, lte, and, asc, desc, sql, ilike } from 'drizzle-orm';

const PER_PAGE = 8;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const offset = (page - 1) * PER_PAGE;

  const allCategories = await db.select().from(categories);
  const categoryId = allCategories.find((c) => c.slug === category)?.id;

  const search = searchParams.get('search');

  const filters = [];
  if (categoryId) filters.push(eq(products.categoryId, categoryId));
  if (minPrice) filters.push(gte(products.price, minPrice));
  if (maxPrice) filters.push(lte(products.price, maxPrice));
    if (search) filters.push(ilike(products.name, `%${search}%`));

  const where = filters.length > 0 ? and(...filters) : undefined;

  const primaryOrder =
    sort === 'price_asc' ? asc(products.price) :
    sort === 'price_desc' ? desc(products.price) :
    desc(products.createdAt);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(where);

  const results = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(primaryOrder, asc(products.id))
    .limit(PER_PAGE)
    .offset(offset);

  return NextResponse.json({
    products: results,
    hasMore: results.length === PER_PAGE,
    count: Number(count),
  });
}