import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

/*
What this does:
Creates the db object you'll import everywhere to query the database. It uses Neon's HTTP-based serverless driver which works in Next.js edge and server environments.
*/