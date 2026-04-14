import React, { useContext, useEffect, useState } from "react";
import styles from "./TutorialPage.module.scss";
import Tutorial from "./components/Tutorial";
import CommonButton from "../../components/commonButton/CommonButton";
import { useNavigate } from "react-router-dom";
import { cctvApi } from "../../apis/cctvApi";
import { UserContext } from "../../stores/UserContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function TutorialPage() {
  const [cctvName, setCctvName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [cctvAdmin, setCctvAdmin] = useState("");
  const [stream, setStream] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSaveCctv = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await cctvApi.createCctv({
        user_id: user.user_id,
        cctv_name: cctvName,
        ip_address: ipAddress,
        cctv_admin: cctvAdmin,
        cctv_path: stream,
        cctv_password: password,
      });
      if (response.success) {
        toast.success("CCTV 추가 성공");
        navigate("/cctv");
      } else {
        toast.error(response.message || "CCTV 추가 실패");
        console.error(response.message);
      }
    } catch (error) {
      console.error("Tutorial Page: ", error);
    } finally {
      setLoading(false);
    }
  };

  const [showTutorial, setShowTutorial] = useState(false);

  const tutorialSteps = [
    {
      target: "#homepage-menu",
      title: "홈페이지",
      description:
        "감지된 이상행동 리스트를 확인할 수 있어요. 날짜, 유형 필터링을 통해 원하는 영상을 검색할 수 있어요.",
    },
    {
      target: "#calendarpage-menu",
      title: "달력",
      description:
        "달력을 통해 해당 달의 이상행동 발생 여부를 한 눈에 확인할 수 있어요.",
    },
    {
      target: "#cctvpage-menu",
      title: "CCTV 관리",
      description:
        "등록한 CCTV를 확인할 수 있어요. CCTV를 추가하거나, 수정, 삭제할 수 있어요.",
    },
    {
      target: "#guidepage-menu", // CSS 선택자 - 사용자 프로필
      title: "사용 가이드",
      description: "자세한 사용 가이드를 확인할 수 있어요.",
    },
    {
      target: "#mypage-menu", // CSS 선택자 - 사용자 프로필
      title: "마이 페이지",
      description:
        "회원 정보 및 알림 설정, 잔여 저장 공간을 확인할 수 있어요. 회원 정보 수정, 탈퇴도 가능해요.",
    },
  ];

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem("tutorialCompleted");
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem("tutorialCompleted", "true");
    setShowTutorial(false);
  };

  return (
    <div className={styles.tutorialpage}>
      <div className={styles.tutorialpage__welcome}>
        {/* <img
          src={meerkatImage}
          className={styles.tutorialpage__welcome__image}
        ></img> */}
        <div className={styles.tutorialpage__welcome__text}>
          <div className={styles.tutorialpage__welcome__text__title}>
            <span>미어캣 AI와 함께</span>
            <span> 새로운 여정을</span>
            <span>시작하세요!</span>
          </div>
          <span className={styles.tutorialpage__welcome__text__subtitle}>
            더 빠르고 스마트한 탐색을 지금 바로 경험해보세요.
          </span>
        </div>
      </div>
      <div className={styles.tutorialpage__cctv}>
        <span className={styles.tutorialpage__cctv__title}>CCTV 등록</span>
        <div className={styles.tutorialpage__cctv__content}>
          <span className={styles.tutorialpage__cctv__content__subtitle}>
            CCTV 정보 입력
          </span>
          <div className={styles.tutorialpage__cctv__content__inner}>
            <div className={styles.tutorialpage__cctv__content__inner__left}>
              <div className={styles.row}>
                <label>CCTV 이름</label>
                <input
                  className={styles.input}
                  value={cctvName}
                  onChange={(e) => setCctvName(e.target.value)}
                  placeholder="이름 (ex: 현관 앞)"
                ></input>
              </div>
              <div className={styles.row}>
                <label>IP 주소</label>
                <input
                  className={styles.input}
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="IP 주소 (ex: 123.123.123.123)"
                ></input>
              </div>
              <div className={styles.row}>
                <label>CCTV Admin</label>
                <input
                  className={styles.input}
                  value={cctvAdmin}
                  onChange={(e) => setCctvAdmin(e.target.value)}
                  placeholder="CCTV Admin (ex: admin)"
                ></input>
              </div>
              <CommonButton
                label="저장"
                size="large"
                color="primary"
                onClick={handleSaveCctv}
              ></CommonButton>
            </div>
            <div className={styles.tutorialpage__cctv__content__inner__right}>
              <div className={styles.row}>
                <label>스트림 경로</label>
                <input
                  className={styles.input}
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  placeholder="스트림 경로 (ex: /main)"
                ></input>
              </div>
              <div className={styles.row}>
                <label>비밀번호</label>
                <input
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="CCTV 비밀번호"
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tutorial
        steps={tutorialSteps}
        isEnabled={showTutorial}
        onComplete={handleTutorialComplete}
        routePath="/tutorial"
      />
      {loading && (
        <div className={styles.loader}>
          <ClipLoader color="#2c3e50" loading={loading} size={50} />
        </div>
      )}
    </div>
  );
}
