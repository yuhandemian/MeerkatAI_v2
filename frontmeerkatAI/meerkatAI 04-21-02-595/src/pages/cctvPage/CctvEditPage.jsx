import React, { useContext, useEffect, useState } from "react";
import styles from "./CctvPage.module.scss";
import CommonButton from "../../components/commonButton/CommonButton";
import { useLocation, useNavigate } from "react-router-dom";
import { cctvApi } from "../../apis/cctvApi";
import { UserContext } from "../../stores/UserContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function CctvEditPage() {
  const location = useLocation();
  const { cctv } = location.state || {};
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [cctvId, setCctvId] = useState("");
  const [cctvName, setCctvName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [cctvAdmin, setCctvAdmin] = useState("");
  const [stream, setStream] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(cctv);
    if (cctv) {
      setCctvId(cctv.cctv_id || "");
      setCctvName(cctv.cctv_name || "");
      setIpAddress(cctv.ip_address || "");
      setCctvAdmin(cctv.cctv_admin || "");
      setStream(cctv.cctv_path || "");
    }
  }, [cctv]);

  const handleSaveCctv = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (location.pathname.endsWith("add")) {
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
        console.error("CCTV Edit Page: ", error);
      } finally {
        setLoading(false);
      }
    } else if (location.pathname.endsWith("edit")) {
      try {
        const response = await cctvApi.updateCctv(cctvId, {
          user_id: user.user_id,
          cctv_name: cctvName,
          ip_address: ipAddress,
          cctv_admin: cctvAdmin,
          cctv_path: stream,
          cctv_password: password,
        });
        if (response.success) {
          toast.success("CCTV 수정 성공");
          navigate("/cctv");
        } else {
          toast.error(response.message || "CCTV 수정 실패");
          console.error(response.message);
        }
      } catch (error) {
        console.error("CCTV Edit Page: ", error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className={styles.cctvpage}>
      <div className={styles.cctvpage__wrapper}>
        <span className={styles.cctvpage__wrapper__title}>CCTV 관리</span>
        <div className={styles.cctvpage__wrapper__content}>
          <span className={styles.cctvpage__wrapper__content__subtitle}>
            CCTV 정보 입력
          </span>
          <div className={styles.cctvpage__wrapper__content__inner}>
            <div className={styles.row}>
              <label>CCTV 이름</label>
              <input
                className={styles.input}
                value={cctvName}
                onChange={(e) => setCctvName(e.target.value)}
                placeholder="이름"
              ></input>
            </div>
            <div className={styles.row}>
              <label>IP 주소</label>
              <input
                className={styles.input}
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="IP 주소"
              ></input>
            </div>
            <div className={styles.row}>
              <label>CCTV Admin</label>
              <input
                className={styles.input}
                value={cctvAdmin}
                onChange={(e) => setCctvAdmin(e.target.value)}
                placeholder="CCTV Admin (기본값은 admin입니다.)"
              ></input>
            </div>
            <div className={styles.row}>
              <label>스트림 경로</label>
              <input
                className={styles.input}
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="스트림 경로"
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
            <CommonButton
              label="저장"
              size="large"
              color="primary"
              onClick={handleSaveCctv}
            ></CommonButton>
            {loading && (
              <div className={styles.loader}>
                <ClipLoader color="#2c3e50" loading={loading} size={50} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
