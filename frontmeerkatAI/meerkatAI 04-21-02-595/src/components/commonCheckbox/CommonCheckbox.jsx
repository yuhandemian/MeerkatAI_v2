import React from "react";
import styles from "./CommonCheckbox.module.scss";

export default function CommonCheckbox({ children, checked, onChange, id }) {
  return (
    <label className={styles.checkbox} htmlFor={id}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.checkbox__box}></span>
      <span className={styles.checkbox__text}>{children}</span>
    </label>
  );
}
