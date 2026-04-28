import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to review' }, { status: 401 });
  }

  const { productId, rating, comment } = await req.json();

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid review data' }, { status: 400 });
  }

  // Check if user already reviewed this product
  const [existing] = await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.productId, productId),
        eq(reviews.userId, Number(session.user?.id))
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ error: 'You already reviewed this product' }, { status: 409 });
  }

  await db.insert(reviews).values({
    productId,
    userId: Number(session.user?.id),
    rating,
    comment,
  });

  return NextResponse.json({ success: true });
}