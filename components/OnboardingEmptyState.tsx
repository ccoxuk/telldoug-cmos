import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import styles from "./OnboardingEmptyState.module.css";

export function OnboardingEmptyState() {
  return (
    <section className={styles.card} aria-labelledby="onboarding-title">
      <div className={styles.header}>
        <h2 id="onboarding-title" className={styles.title}>
          Start your career timeline
        </h2>
        <p className={styles.subtitle}>
          Add a few core items to unlock your dashboard insights.
        </p>
      </div>

      <ol className={styles.checklist}>
        <li>Add your first job</li>
        <li>Add a project you shipped</li>
        <li>Add 3-5 skills as evidence</li>
      </ol>

      <div className={styles.actions}>
        <Button asChild>
          <Link to="/jobs?new=1">Add your first job</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/projects">Add project</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/people">Add person</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/institutions">Add institution</Link>
        </Button>
      </div>
    </section>
  );
}
