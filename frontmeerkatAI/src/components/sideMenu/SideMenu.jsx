import React, { useState, useEffect } from "react";
import styles from "./SideMenu.module.scss";
import MenuItem from "../menuItem/MenuItem";
import Modal from "../modal/Modal";
import TermContent from "../termContent/TermContent";
import Tutorial from "../../pages/tutorialPage/components/Tutorial";

export default function SideMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClickLeft, setIsClickLeft] = useState(true);

  return (
    <div className={styles.sidemenu}>
      <div className={styles.sidemenu__title}>메뉴</div>
      <div className={styles.sidemenu__separator}></div>
      <ul className={styles.sidemenu__list}>
        <MenuItem label="홈페이지" to="/" />
        <MenuItem label="캘린더" to="/calendar" />
        <MenuItem label="CCTV 관리" to="/cctv" />
        <MenuItem label="이용가이드" to="/guide" />
        <MenuItem label="마이페이지" to="/mypage" />
      </ul>
      <div className={styles.sidemenu__terms}>
        <button
          className={styles.sidemenu__terms__button}
          onClick={() => {
            setIsModalOpen(true);
            setIsClickLeft(true);
          }}
        >
          이용약관
        </button>
        <span>|</span>
        <button
          className={styles.sidemenu__terms__button}
          onClick={() => {
            setIsModalOpen(true);
            setIsClickLeft(false);
          }}
        >
          개인정보처리방침
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TermContent isClickLeft={isClickLeft}></TermContent>
      </Modal>
    </div>
  );
}
