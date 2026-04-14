import React from "react";
import styles from "./CommonToggle.module.scss";
import classNames from "classnames";

export default function CommonToggle({ checked, onToggle }) {
  return (
    <div
      className={classNames(styles.toggle, {
        [styles["toggle--on"]]: checked,
      })}
      onClick={onToggle}
    >
      <div className={styles.toggle__circle}></div>
    </div>
  );
}
