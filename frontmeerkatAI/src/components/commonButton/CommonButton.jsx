import React from "react";
import styles from "./CommonButton.module.scss";

function CommonButton({
  icon,
  label,
  size = "large",
  color = "primary",
  onClick,
}) {
  return (
    <button
      className={`${styles.commonbutton} ${styles[size]} ${styles[color]}`}
      onClick={onClick}
    >
      {icon && <span className={styles.commonbutton__icon}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default CommonButton;
