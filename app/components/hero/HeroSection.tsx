import styles from "./hero.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Build Your Dream <br />
        <span className={styles.highlight}>Cricket Team</span>
      </h1>

      <p className={styles.subtitle}>
        Join millions of fans in the ultimate fantasy cricket experience.
        Create teams, compete in contests, and win real prizes!
      </p>

      <div className={styles.actions}>
        <button className={styles.primaryBtn}>Start Playing Free</button>
        <button className={styles.secondaryBtn}>Login</button>
      </div>
    </section>
  );
}
