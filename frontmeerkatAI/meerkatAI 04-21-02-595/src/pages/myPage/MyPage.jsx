import React, { useState, useContext, useEffect } from "react";
import styles from "./MyPage.module.scss";
import CommonButton from "@components/commonButton/CommonButton";
import { UserContext } from "@stores/UserContext";
import { userApi } from "@apis/userApi";
import StorageBar from "./components/stoargeBar/StorageBar";
import { useNavigate } from "react-router-dom";
import CommonToggle from "../../components/commonToggle/CommonToggle";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function MyPage() {
  const { user, setUser } = useContext(UserContext);
  const [isAlarm, setIsAlarm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeInfo = () => {
    navigate("edit");
  };

  const handleWithdraw = () => {
    navigate("withdraw", { state: { email: user.user_email } });
  };

  const handleAlarm = async () => {
    setLoading(true);
    const nextAlarm = !isAlarm;
    // 알림 설정 변경 api
    try {
      const response = await userApi.updateNotification({
        notification: nextAlarm,
      });
      if (response.success) {
        setUser({
          ...user,
          notify_status: nextAlarm,
        });
        toast.info(`${nextAlarm ? "알림 켜짐" : "알림 꺼짐"}`);
      } else {
        toast.error(response.message || "알림 설정 변경 실패");
        console.error(response.message);
      }
    } catch (error) {
      console.error("Mypage: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsAlarm(user.notify_status);
    }
  }, [user]);

  return (
    <div className={styles.mypage}>
      <div className={styles.mypage__wrapper}>
        <span className={styles.mypage__wrapper__title}>마이 페이지</span>
        <div className={styles.mypage__wrapper__content}>
          <span className={styles.mypage__wrapper__content__subtitle}>
            개인정보 관리
          </span>
          <div className={styles.mypage__wrapper__content__inner}>
            <div className={styles.row}>
              <label>사용자 이메일</label>
              <span className={styles.gray}>
                {user ? user.user_email : "null"}
              </span>
            </div>
            <div className={styles.row}>
              <label>이름</label>
              <span className={styles.gray}>
                {user ? user.user_name : "null"}
              </span>
            </div>
            <CommonButton
              label="개인정보 수정"
              size="small"
              color="primary"
              onClick={handleChangeInfo}
            ></CommonButton>
          </div>
        </div>
        <div className={styles.mypage__wrapper__content}>
          <span className={styles.mypage__wrapper__content__subtitle}>
            알람 설정
          </span>
          <div className={styles.mypage__wrapper__content__inner}>
            <div className={styles.row}>
              <label>이메일 수신 여부</label>
              <CommonToggle checked={isAlarm} onToggle={handleAlarm} />
            </div>
          </div>
        </div>
        <div className={styles.mypage__wrapper__content}>
          <span className={styles.mypage__wrapper__content__subtitle}>
            잔여 저장 공간
          </span>
          <div className={styles.mypage__wrapper__content__inner}>
            <StorageBar
              total={user ? user.total_space / 1024 / 1024 / 1024 : 10}
              used={user ? user.used_space / 1024 / 1024 / 1024 : 4.0}
            />
          </div>
        </div>
        <div className={styles.mypage__wrapper__content}>
          <span className={styles.mypage__wrapper__content__subtitle}>
            회원 탈퇴
          </span>
          <div className={styles.mypage__wrapper__content__inner}>
            <div className={styles.row}>
              <label>회원 탈퇴</label>
              <CommonButton
                label="회원 탈퇴"
                size="small"
                color="primary"
                onClick={handleWithdraw}
              ></CommonButton>
            </div>
          </div>
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
