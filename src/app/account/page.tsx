import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import styles from './page.module.css';



export const metadata = {
  title: 'My Account',
  description: 'View your profile and order history.',
};

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, Number(session.user?.id ?? 0)));

      console.log('Session user id:', session.user?.id);
  console.log('Orders found:', userOrders.length);

  return (
    
    <div className={styles.container}>
      <h1 className={styles.title}>My Account</h1>

      <section className={styles.section}>
        <h2>Profile</h2>
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
      </section>

      <section className={styles.section}>
        <h2>Order History</h2>
        {userOrders.length === 0 ? (
          <p className={styles.empty}>No orders yet.</p>
        ) : (
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
              {userOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.createdAt?.toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>€{Number(order.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}