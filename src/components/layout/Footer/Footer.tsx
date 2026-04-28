import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <h3>ShopForge</h3>
          <p>Quality products, delivered fast.<br />Your one-stop online shop.</p>
        </div>

        <div className={styles.column}>
          <h4>Shop</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Account</h4>
          <ul>
            <li><Link href="/account">My Account</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} ShopForge. All rights reserved.</p>
      </div>
    </footer>
  );
}