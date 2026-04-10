import Link from 'next/link';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2>Admin</h2>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
        </nav>
      </aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}