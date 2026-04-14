import React, { useState, useEffect } from "react";
import styles from "./Layout.module.scss";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../header/Header";
import SideMenu from "../sideMenu/SideMenu";
import Chatbot from "../chatbot/Chatbot";

export default function SideMenuLayout() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  function isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // payload 추출
      const now = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
      return payload.exp < now; // 만료됐으면 true 반환
    } catch (e) {
      console.error("토큰 파싱 실패:", e);
      return true; // 파싱 실패 시 만료된 것으로 간주
    }
  }

  if (isTokenExpired(token)) {
    return <Navigate to={"/login"} replace />;
  }

  const location = useLocation();
  const hideChatbot = ["/login", "/signup", "/auth"].some((p) => location.pathname.startsWith(p));

  return (
    <div className={styles.layoutwrapper}>
      <Header isInfo={true} />
      <main className={styles.layoutwrapper__sidemenu}>
        <SideMenu />
        <Outlet />
      </main>
      {!hideChatbot && <Chatbot />}
    </div>
  );
}
