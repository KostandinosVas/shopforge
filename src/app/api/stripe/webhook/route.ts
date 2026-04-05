import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId ? Number(session.metadata.userId) : null;
    const total = (session.amount_total ?? 0) / 100;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    const [order] = await db
      .insert(orders)
      .values({
        userId,
        total: String(total),
        status: 'paid',
        stripeSessionId: session.id,
        shippingAddress: null,
      })
      .returning();

    for (const item of lineItems.data) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: null,
        quantity: item.quantity ?? 1,
        price: String((item.amount_total ?? 0) / 100),
      });
    }
  }

  return NextResponse.json({ received: true });
}