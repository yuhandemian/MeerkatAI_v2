import React from "react";
import styles from "./Layout.module.scss";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Chatbot from "../chatbot/Chatbot";

export default function DefaultLayout() {
  return (
    <div className={styles.layoutwrapper}>
      <Header isInfo={false} />
      <main className={styles.layoutwrapper__default}>
        <Outlet />
      </main>
    </div>
  );
}
