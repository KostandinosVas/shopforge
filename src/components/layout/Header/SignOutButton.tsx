'use client';

import { signOut } from 'next-auth/react';
import styles from './Header.module.css';

export default function SignOutButton() {
  return (
    <button className={styles.authBtn} onClick={() => signOut({ callbackUrl: '/' })}>
      Log out
    </button>
  );
}