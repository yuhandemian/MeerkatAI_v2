import React, { useState } from "react";
import styles from "./StorageBar.module.scss";

export default function StorageBar({ total, used }) {
  const usedPercentage = Math.min((used / total) * 100);
  const formattedUsed = used.toFixed(2);
  return (
    <div className={styles.bar}>
      <div className={styles.bar__container}>
        <div
          className={styles.bar__container__used}
          style={{ width: `${usedPercentage}%` }}
        ></div>
        <div className={styles.bar__container__tooltip}>
          {formattedUsed}GB 사용 / {total}GB 중 {usedPercentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
