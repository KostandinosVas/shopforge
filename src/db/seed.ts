import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { categories, products } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log('Seeding database...');

  // Insert categories
  const insertedCategories = await db
    .insert(categories)
    .values([
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Accessories', slug: 'accessories' },
      { name: 'Footwear', slug: 'footwear' },
    ])
    .returning();

  const [clothing, accessories, footwear] = insertedCategories;

  // Insert products
  await db.insert(products).values([
    // Clothing
    { name: 'Classic White Tee', slug: 'classic-white-tee', description: 'A timeless white t-shirt.', price: '19.99', stock: 100, categoryId: clothing.id },
    { name: 'Black Hoodie', slug: 'black-hoodie', description: 'Cozy black pullover hoodie.', price: '49.99', stock: 60, categoryId: clothing.id },
    { name: 'Slim Fit Jeans', slug: 'slim-fit-jeans', description: 'Modern slim fit denim.', price: '59.99', stock: 80, categoryId: clothing.id },
    { name: 'Linen Shirt', slug: 'linen-shirt', description: 'Breathable summer linen shirt.', price: '39.99', stock: 50, categoryId: clothing.id },
    // Accessories
    { name: 'Leather Wallet', slug: 'leather-wallet', description: 'Slim genuine leather wallet.', price: '29.99', stock: 120, categoryId: accessories.id },
    { name: 'Canvas Backpack', slug: 'canvas-backpack', description: 'Durable everyday backpack.', price: '69.99', stock: 40, categoryId: accessories.id },
    { name: 'Wool Beanie', slug: 'wool-beanie', description: 'Warm knitted wool beanie.', price: '14.99', stock: 200, categoryId: accessories.id },
    { name: 'Sunglasses', slug: 'sunglasses', description: 'UV400 polarised sunglasses.', price: '34.99', stock: 75, categoryId: accessories.id },
    // Footwear
    { name: 'White Sneakers', slug: 'white-sneakers', description: 'Clean minimal white sneakers.', price: '89.99', stock: 90, categoryId: footwear.id },
    { name: 'Chelsea Boots', slug: 'chelsea-boots', description: 'Classic leather Chelsea boots.', price: '129.99', stock: 35, categoryId: footwear.id },
    { name: 'Running Shoes', slug: 'running-shoes', description: 'Lightweight performance runners.', price: '109.99', stock: 55, categoryId: footwear.id },
    { name: 'Sandals', slug: 'sandals', description: 'Comfortable summer sandals.', price: '44.99', stock: 65, categoryId: footwear.id },
  ]);

  console.log('Done! 3 categories and 12 products inserted.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});