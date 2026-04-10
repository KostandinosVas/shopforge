import { db } from '@/db';
import { orders, products, users } from '@/db/schema';
import { sql } from 'drizzle-orm';
import styles from './page.module.css';

export default async function DashboardPage() {
  const [{ count: orderCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders);

  const [{ count: productCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);

  const [{ count: userCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const [{ total }] = await db
    .select({ total: sql<number>`coalesce(sum(total), 0)` })
    .from(orders);

  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(sql`created_at desc`)
    .limit(5);

  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Total Revenue</p>
          <p className={styles.statValue}>€{Number(total).toFixed(2)}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Orders</p>
          <p className={styles.statValue}>{orderCount}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Products</p>
          <p className={styles.statValue}>{productCount}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Users</p>
          <p className={styles.statValue}>{userCount}</p>
        </div>
      </div>

      <h2 className={styles.subtitle}>Recent Orders</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.createdAt?.toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>€{Number(order.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}