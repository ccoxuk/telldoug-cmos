import React from "react";
import { BRAND_NAME, LOGO_DOG_URL, LOGO_LOCKUP_URL } from "../helpers/brand";
import styles from "./Logo.module.css";

type LogoVariant = "dog" | "lockup";

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
};

export function Logo({ variant = "lockup", className }: LogoProps) {
  const src = variant === "dog" ? LOGO_DOG_URL : LOGO_LOCKUP_URL;
  const alt =
    variant === "dog"
      ? `${BRAND_NAME} Dog Logo`
      : `${BRAND_NAME} Logo`;

  return (
    <div
      className={`${styles.wrapper} ${variant === "dog" ? styles.dog : styles.lockup} ${
        className ?? ""
      }`}
      aria-label={alt}
    >
      <img src={src} alt={alt} className={styles.image} />
    </div>
  );
}
