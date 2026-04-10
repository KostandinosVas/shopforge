import { db } from '@/db';
import { orders } from '@/db/schema';
import { sql } from 'drizzle-orm';
import styles from './page.module.css';

export default async function AdminOrdersPage() {
  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(sql`created_at desc`);

  return (
    <div>
      <h1 className={styles.title}>Orders</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>User ID</th>
            <th>Status</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.createdAt?.toLocaleDateString()}</td>
              <td>{order.userId ?? '—'}</td>
              <td>
                <span className={`${styles.badge} ${styles[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td>€{Number(order.total).toFixed(2)}</td>
              <td>
                <form action={`/api/admin/orders/${order.id}/ship`} method="POST">
                  <button
                    type="submit"
                    className={styles.shipBtn}
                    disabled={order.status === 'shipped'}
                  >
                    Mark Shipped
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}