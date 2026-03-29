import Link from 'next/link';
import { auth } from '@/lib/auth';
import CartIcon from './CartIcon';
import SignOutButton from './SignOutButton';
import styles from './Header.module.css';

export default async function Header() {
  const session = await auth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          ShopForge
        </Link>

        <nav>
          <ul className={styles.nav}>
            <li><Link href="/products">Shop</Link></li>
          </ul>
        </nav>

        <div className={styles.actions}>
          {session ? (
            <>
              <Link href="/account" className={styles.greeting}>
                Hi, {session.user?.name}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/login" className={styles.authBtn}>Log in</Link>
          )}
          <CartIcon />
        </div>
      </div>
    </header>
  );
}