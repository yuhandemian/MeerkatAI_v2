import React, { useEffect, useState } from "react";
import styles from "./MenuItem.module.scss";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faCalendar,
  faVideo,
  faFileLines,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

const getBasePath = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 0 ? `/${segments[0]}` : "/";
};

export default function MenuItem({ label, to }) {
  const location = useLocation();
  const isActive = getBasePath(location.pathname) === to;

  const icontype = {
    홈페이지: faHouseChimney,
    캘린더: faCalendar,
    "CCTV 관리": faVideo,
    이용가이드: faFileLines,
    마이페이지: faGear,
  }[label];

  const idtype = {
    홈페이지: "homepage-menu",
    캘린더: "calendarpage-menu",
    "CCTV 관리": "cctvpage-menu",
    이용가이드: "guidepage-menu",
    마이페이지: "mypage-menu",
  }[label];

  return (
    <li className={`${styles.menuitem} ${isActive ? styles.selected : ""}`}>
      <Link id={idtype} className={styles.menuitem__link} to={to}>
        <span className={styles.menuitem__link__icon}>
          <FontAwesomeIcon icon={icontype} />
        </span>
        {label}
      </Link>
    </li>
  );
}
