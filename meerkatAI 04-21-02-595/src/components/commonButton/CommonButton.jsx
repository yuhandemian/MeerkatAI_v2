import React from "react";
import styles from "./CommonButton.module.scss";

function CommonButton({
  icon,
  label,
  size = "large",
  color = "primary",
  onClick,
  disabled = false,
}) {
  return (
    <button
      className={`${styles.commonbutton} ${styles[size]} ${styles[color]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.commonbutton__icon}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default CommonButton;
