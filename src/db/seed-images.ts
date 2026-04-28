import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { products } from './schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedImages() {
  console.log('Adding images to products...');

  const allProducts = await db.select().from(products);

  for (const product of allProducts) {
    const imageUrl = `https://picsum.photos/seed/${product.slug}/600/600`;
    await db
      .update(products)
      .set({ images: [imageUrl] })
      .where(eq(products.id, product.id));
    console.log(`Updated: ${product.name}`);
  }

  console.log('Done!');
  process.exit(0);
}

seedImages().catch((err) => {
  console.error(err);
  process.exit(1);
});