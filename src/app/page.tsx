import CalendarWrapper from '@/components/Calendar/CalendarWrapper';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📅</span>
          <h1 className={styles.logoText}>Wall<span>Cal</span></h1>
        </div>
        <p className={styles.tagline}>Your interactive wall calendar</p>
      </header>

      <CalendarWrapper />

      <footer className={styles.footer}>
        <p>Click a day to start a range · Click again to end it · Add notes per month or range</p>
      </footer>
    </main>
  );
}
