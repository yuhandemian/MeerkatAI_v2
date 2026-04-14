import React, { useContext, useState } from "react";
import styles from "./AuthPages.module.scss";
import AuthBox from "@components/authBox/AuthBox";
import CommonButton from "../../components/commonButton/CommonButton";
import CommonCheckbox from "../../components/commonCheckbox/CommonCheckbox";
import { useNavigate } from "react-router-dom";
import { userApi } from "@apis/userApi";
import { toast } from "react-toastify";
import { UserContext } from "../../stores/UserContext";
import { ClipLoader } from "react-spinners";

export default function LoginPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isStay, setIsStay] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userApi.login({
        user_email: userEmail,
        user_password: userPassword,
      });

      if (response.success) {
        toast.success("로그인 성공");
        localStorage.setItem("token", response.data.token);
        console.log(response);
        setUser({
          user_id: response.data.user_id,
          user_name: response.data.user_name,
          user_email: userEmail,
          used_space: response.data.used_space,
          total_space: response.data.total_space,
          notify_status: response.data.notify_status,
        });
        if (response.data.first_login) {
          localStorage.removeItem("tutorialCompleted");
          navigate("/tutorial");
        } else {
          navigate("/");
        }
      } else {
        toast.error(response.error.message);
        console.error(response.error.message);
      }
    } catch (error) {
      console.error("LoginPage: ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.pagewrapper}>
      <AuthBox
        title="로그인"
        submitButton={
          <CommonButton
            label="로그인"
            color="primary"
            size="large"
            onClick={handleLogin}
          >
            로그인
          </CommonButton>
        }
        isLogin={true}
        contentStart="blank"
      >
        <form className={styles.pagewrapper__form}>
          <input
            className={styles.pagewrapper__form__input}
            type="email"
            placeholder="이메일"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
          <input
            className={styles.pagewrapper__form__input}
            type="password"
            placeholder="비밀번호"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
          />
          <CommonCheckbox checked={isStay} onChange={setIsStay}>
            로그인 상태 유지
          </CommonCheckbox>
        </form>
      </AuthBox>
      {loading && (
        <div className={styles.loader}>
          <ClipLoader color="#2c3e50" loading={loading} size={50} />
        </div>
      )}
    </div>
  );
}
