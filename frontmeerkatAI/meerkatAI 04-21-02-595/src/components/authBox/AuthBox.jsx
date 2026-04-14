import React from "react";
import { Link } from "react-router-dom";
import styles from "./AuthBox.module.scss";

export default function AuthBox({
  title,
  children,
  submitButton,
  isLogin,
  contentStart,
}) {
  return (
    <div className={styles.authbox}>
      <span className={styles.authbox__title}>{title}</span>
      <div
        className={`${styles.authbox__content} ${
          contentStart === "blank" ? styles.blank : ""
        }`}
      >
        {children}
      </div>
      <div className={styles.authbox__bottom}>
        {submitButton}
        {isLogin && (
          <div className={styles.authbox__bottom__go}>
            <Link
              to="/find-password"
              className={styles.authbox__bottom__go__link}
            >
              비밀번호 찾기
            </Link>
            <Link to="/register" className={styles.authbox__bottom__go__link}>
              회원가입
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
