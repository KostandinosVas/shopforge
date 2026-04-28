import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { categories, products } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedMore() {
  console.log('Seeding additional categories and products...');

  const insertedCategories = await db
    .insert(categories)
    .values([
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Home & Living', slug: 'home-living' },
      { name: 'Sports', slug: 'sports' },
      { name: 'Books', slug: 'books' },
      { name: 'Beauty & Skincare', slug: 'beauty-skincare' },
    ])
    .returning();

  const [electronics, homeLiving, sports, books, beauty] = insertedCategories;

  await db.insert(products).values([
    // Electronics
    { name: 'Wireless Earbuds', slug: 'wireless-earbuds', description: 'True wireless earbuds with noise cancellation.', price: '79.99', stock: 80, categoryId: electronics.id },
    { name: 'USB-C Hub', slug: 'usb-c-hub', description: '7-in-1 USB-C hub with HDMI and card reader.', price: '39.99', stock: 60, categoryId: electronics.id },
    { name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', description: 'Compact TKL mechanical keyboard, blue switches.', price: '99.99', stock: 45, categoryId: electronics.id },
    { name: 'Portable Charger', slug: 'portable-charger', description: '20000mAh fast-charge power bank.', price: '49.99', stock: 70, categoryId: electronics.id },

    // Home & Living
    { name: 'Scented Candle Set', slug: 'scented-candle-set', description: 'Set of 3 natural soy wax candles.', price: '24.99', stock: 90, categoryId: homeLiving.id },
    { name: 'Ceramic Mug', slug: 'ceramic-mug', description: 'Handmade 350ml ceramic coffee mug.', price: '16.99', stock: 150, categoryId: homeLiving.id },
    { name: 'Throw Blanket', slug: 'throw-blanket', description: 'Soft knitted throw blanket, 130x170cm.', price: '44.99', stock: 55, categoryId: homeLiving.id },
    { name: 'Desk Plant', slug: 'desk-plant', description: 'Low-maintenance succulent in a terracotta pot.', price: '12.99', stock: 100, categoryId: homeLiving.id },

    // Sports
    { name: 'Water Bottle', slug: 'water-bottle', description: 'Insulated stainless steel 750ml bottle.', price: '22.99', stock: 120, categoryId: sports.id },
    { name: 'Resistance Bands Set', slug: 'resistance-bands-set', description: 'Set of 5 resistance bands for home workouts.', price: '18.99', stock: 85, categoryId: sports.id },
    { name: 'Yoga Mat', slug: 'yoga-mat', description: 'Non-slip 6mm thick yoga and exercise mat.', price: '34.99', stock: 70, categoryId: sports.id },
    { name: 'Jump Rope', slug: 'jump-rope', description: 'Adjustable speed jump rope with ball bearings.', price: '14.99', stock: 110, categoryId: sports.id },

    // Books
    { name: 'Atomic Habits', slug: 'atomic-habits', description: 'Tiny changes, remarkable results by James Clear.', price: '14.99', stock: 200, categoryId: books.id },
    { name: 'The Pragmatic Programmer', slug: 'pragmatic-programmer', description: 'Your journey to mastery by Hunt & Thomas.', price: '39.99', stock: 60, categoryId: books.id },
    { name: 'Deep Work', slug: 'deep-work', description: 'Rules for focused success by Cal Newport.', price: '13.99', stock: 150, categoryId: books.id },
    { name: 'Design Patterns', slug: 'design-patterns', description: 'Elements of reusable object-oriented software.', price: '44.99', stock: 40, categoryId: books.id },

    // Beauty & Skincare
    { name: 'Vitamin C Serum', slug: 'vitamin-c-serum', description: 'Brightening 20% Vitamin C face serum.', price: '28.99', stock: 95, categoryId: beauty.id },
    { name: 'Moisturising Cream', slug: 'moisturising-cream', description: 'Lightweight daily hydrating moisturiser.', price: '19.99', stock: 110, categoryId: beauty.id },
    { name: 'Lip Balm Set', slug: 'lip-balm-set', description: 'Set of 4 natural beeswax lip balms.', price: '9.99', stock: 200, categoryId: beauty.id },
    { name: 'Face Roller', slug: 'face-roller', description: 'Rose quartz facial massage roller.', price: '21.99', stock: 75, categoryId: beauty.id },
  ]);

  console.log('Done! 5 categories and 20 products inserted.');
  process.exit(0);
}

seedMore().catch((err) => {
  console.error(err);
  process.exit(1);
});