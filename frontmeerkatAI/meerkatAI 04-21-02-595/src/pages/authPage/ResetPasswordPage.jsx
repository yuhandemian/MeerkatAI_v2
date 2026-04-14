import React, { useState } from "react";
import styles from "./AuthPages.module.scss";
import AuthBox from "@components/authBox/AuthBox";
import CommonButton from "../../components/commonButton/CommonButton";

export default function ResetPasswordPage() {
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordCheck, setUserPasswordCheck] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    console.log(userPassword);
    try {
      // url로 유저 검증 후 해당 유저 비밀번호 변경
    } catch (err) {
      // 실패 시 오류 출력
    }
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = (e) => {
    const pw = e.target.value;
    setUserPassword(pw);
    setIsValid(validatePassword(pw));
  };

  return (
    <div className={styles.pagewrapper}>
      <AuthBox
        title="비밀번호 변경"
        submitButton={
          <CommonButton
            label="변경하기"
            size="large"
            color="primary"
            onClick={handleResetPassword}
          />
        }
        isLogin={false}
        contentStart="blank"
      >
        <form className={styles.pagewrapper__form}>
          <div
            className={`${styles.pagewrapper__form__inputwrapper} ${
              userPassword ? (isValid ? styles.match : styles.mismatch) : ""
            }`}
          >
            <input
              className={styles.pagewrapper__form__inputwrapper__input}
              type="password"
              placeholder="비밀번호(영문, 숫자, 특수문자 조합 8자리 이상)"
              value={userPassword}
              onChange={handleChangePassword}
              autoComplete="new-password"
            />
          </div>
          <div
            className={`${styles.pagewrapper__form__inputwrapper} ${
              userPasswordCheck
                ? userPassword === userPasswordCheck
                  ? styles.match
                  : styles.mismatch
                : ""
            }`}
          >
            <input
              className={styles.pagewrapper__form__inputwrapper__input}
              type="password"
              placeholder="비밀번호 확인"
              value={userPasswordCheck}
              onChange={(e) => setUserPasswordCheck(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </form>
      </AuthBox>
    </div>
  );
}
