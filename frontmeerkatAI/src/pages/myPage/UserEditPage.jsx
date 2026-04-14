import React, { useContext, useEffect, useState } from "react";
import styles from "./MyPage.module.scss";
import { UserContext } from "@stores/UserContext";
import CommonButton from "@components/commonButton/CommonButton";
import { toast } from "react-toastify";
import { userApi } from "../../apis/userApi";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function UserEditPage() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChangeInfo = async (e) => {
    e.preventDefault();

    // 비밀번호 일치 체크
    if (!isValid) {
      toast.error("비밀번호 형식을 다시 확인해주세요.");
      return;
    }
    if (password !== passwordCheck) {
      toast.error("변경할 비밀번호가 일치하지 않습니다.");
    }
    // 개인정보 수정 api
    setLoading(true);
    try {
      const response = await userApi.updateUser({
        user_id: user.user_id,
        user_name: name,
        user_password: currentPassword,
        new_password: password,
      });
      if (response.success) {
        toast.success("회원정보 수정 성공");
        setUser({
          ...user,
          name: response.data.user_name,
          isAlarm: response.data.notify_status,
        });
        navigate("/mypage", { replace: true });
      } else {
        toast.error(response.error.message);
        console.error(response.error.message);
      }
    } catch (error) {
      console.error("UserEditPage: ", error);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = (e) => {
    const pw = e.target.value;
    setPassword(pw);
    setIsValid(validatePassword(pw));
  };

  useEffect(() => {
    if (user) {
      setName(user.user_name);
    }
  }, [user]);

  return (
    <div className={styles.mypage}>
      <div className={styles.mypage__wrapper}>
        <span className={styles.mypage__wrapper__title}>마이 페이지</span>
        <div className={styles.mypage__wrapper__content}>
          <span className={styles.mypage__wrapper__content__subtitle}>
            개인정보 수정
          </span>
          <form className={styles.mypage__wrapper__content__inner}>
            <div className={styles.row}>
              <label>사용자 이메일</label>
              <span className={styles.gray}>
                {user ? user.user_email : "*******@gmail.com"}
              </span>
            </div>
            <div className={styles.row}>
              <label>이름</label>
              <input
                className={styles.input}
                value={name}
                autoComplete="username"
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
              ></input>
            </div>
            <div className={styles.row}>
              <label>현재 비밀번호</label>
              <input
                className={styles.input}
                type="password"
                autoComplete="current-password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              ></input>
            </div>
            <div className={styles.row}>
              <label>변경할 비밀번호</label>
              <input
                className={`${styles.input} ${
                  password ? (isValid ? styles.match : styles.mismatch) : ""
                }`}
                type="password"
                autoComplete="new-password"
                placeholder="변경할 비밀번호(영문, 숫자, 특수문자 조합 8자리 이상)"
                value={password}
                onChange={handleChangePassword}
              ></input>
            </div>
            <div className={styles.row}>
              <label>비밀번호 확인</label>
              <input
                className={`${styles.input} ${
                  passwordCheck
                    ? password === passwordCheck
                      ? styles.match
                      : styles.mismatch
                    : ""
                }`}
                type="password"
                autoComplete="new-password"
                placeholder="비밀번호 확인"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              ></input>
            </div>
            <CommonButton
              label="개인정보 수정"
              size="large"
              color="primary"
              onClick={handleChangeInfo}
            ></CommonButton>
          </form>
        </div>
        {loading && (
          <div className={styles.loader}>
            <ClipLoader color="#2c3e50" loading={loading} size={50} />
          </div>
        )}
      </div>
    </div>
  );
}
