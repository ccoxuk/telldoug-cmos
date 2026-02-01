import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "../components/Button";
import styles from "./account.module.css";

export default function AccountPage() {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Account Settings | TellDoug</title>
      </Helmet>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>
            Manage your login and account preferences.
          </p>
        </div>
      </header>

      <section className={styles.card}>
        <h2>Password</h2>
        <p className={styles.helper}>
          Password management will be available in the next release.
        </p>
        <Button variant="outline" disabled>
          Change password (coming soon)
        </Button>
      </section>

      <section className={styles.card}>
        <h2>Account</h2>
        <p className={styles.helper}>
          Account profile editing will be available soon.
        </p>
        <Button variant="outline" disabled>
          Edit account details (coming soon)
        </Button>
      </section>
    </div>
  );
}
