import React, { useContext, useState } from "react";
import styles from "./Header.module.scss";
import Logo from "@assets/images/Logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../stores/UserContext";
import { Link, replace, useNavigate } from "react-router-dom";
import { userApi } from "@apis/userApi";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function Header({ isInfo }) {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // 로그아웃 api 추가
    try {
      const response = await userApi.logout({ user_id: user.user_id });
      if (response.success) {
        toast.success("로그아웃됨");
        localStorage.removeItem("token");
        setUser({});
        navigate("/login");
      } else {
        toast.error(response.error.message);
        console.error(response.error.message);
      }
    } catch (error) {
      console.error("Logout: ", error);
      localStorage.removeItem("token");
      setUser({});
      navigate("/login", replace);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className={styles.header}>
      <Link className={styles.header__logo} to={"/"}>
        <img src={Logo} className={styles.header__logo__image} />
      </Link>
      {isInfo && user ? (
        <div className={styles.header__profile}>
          <button
            className={styles.header__profile__logout}
            onClick={handleLogout}
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              size="lg"
              color="black"
            />{" "}
            <span>로그아웃</span>
          </button>
          <div className={styles.header__profile__hello}>
            <FontAwesomeIcon icon={faCircleUser} size="2x" color="black" />{" "}
            <div>
              <span className={styles.header__profile__hello__name}>
                {user.user_name}
              </span>
              <span>님 안녕하세요!</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {loading && (
        <div className={styles.loader}>
          <ClipLoader color="#2c3e50" loading={loading} size={50} />
        </div>
      )}
    </header>
  );
}
