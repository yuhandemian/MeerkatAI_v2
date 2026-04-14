import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@stores/UserContext";
import styles from "./MyPage.module.scss";
import CommonButton from "../../components/commonButton/CommonButton";
import { ClipLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userApi } from "../../apis/userApi";

export default function UserConfirmPage() {
  const location = useLocation();
  const userEmail = location.state.email || "본인 이메일을 재입력하세요";
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (userEmail !== email) {
      toast.error("이메일을 정확히 입력해주세요");
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.deleteUser({
        user_id: user.user_id,
        user_password: currentPassword,
      });
      if (response.success) {
        toast.success("회원 탈퇴 성공");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      } else {
        toast.error(response.message || "회원 탈퇴 실패");
        console.error(response.error);
      }
    } catch (error) {
      console.error("UserConfirmPage: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mypage}>
      <div className={styles.mypage__wrapper}>
        <span className={styles.mypage__wrapper__title}>마이 페이지</span>
        <div className={styles.mypage__wrapper__content}>
          <span className={styles.mypage__wrapper__content__subtitle}>
            회원 탈퇴
          </span>
          <form className={styles.mypage__wrapper__content__inner}>
            <div className={styles.row}>
              <label>이메일 재입력</label>
              <input
                className={styles.input}
                type="text"
                autoComplete="email"
                placeholder={userEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <CommonButton
              label="회원 탈퇴"
              size="large"
              color="primary"
              onClick={handleWithdraw}
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
