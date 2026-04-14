import React from "react";
import styles from "./GuidePage.module.scss";

export default function GuidePage() {
  return (
    <div className={styles.guidepage}>
      <div className={styles.guidepage__wrapper}>
        <span className={styles.guidepage__wrapper__title}>사용 가이드</span>
        <div className={styles.starter}>
          <span className={styles.title}>🌟 시작하며</span>
          <span className={styles.intro}>
            이 시스템은 여러분의 안전과 편의를 위해 설계되었습니다. 각 기능을
            활용해 보다 스마트한 CCTV 관리를 경험해보세요. 궁금한 점이 있다면
            언제든 문의해주세요.
          </span>
        </div>
        <div className={styles.guidepage__wrapper__content}>
          <div className={styles.guidepage__wrapper__content__left}>
            <div className={styles.homepage}>
              <span className={styles.title}>🏠 홈페이지</span>
              <span className={styles.intro}>
                CCTV로 감지된 모든 순간을 한눈에 관리하세요.
              </span>
              <ul>
                <li>
                  📹 이상 행동 확인
                  <br /> 등록된 CCTV에서 감지된 이상 행동이 저장되면 언제든
                  확인할 수 있습니다.
                </li>
                <li>
                  🚨 감지 가능한 행동
                  <br />
                  전도, 파손, 방화, 흡연, 유기, 절도, 폭행 등 다양한 상황을
                  감지합니다.
                </li>
                <li>
                  🔍 영상 검색
                  <br />
                  날짜와 유형을 선택해 원하는 영상을 빠르게 찾아보세요.
                </li>
                <li>
                  🗑️ 영상 삭제
                  <br />
                  필요 없는 영상은 선택 후 간편하게 삭제할 수 있습니다.
                </li>
                <li>
                  ⬇️ 영상 다운로드
                  <br />
                  필요한 영상을 선택해 간편하게 다운로드할 수 있습니다.
                </li>
                <li>
                  ▶️ 영상 재생
                  <br />
                  썸네일이나 제목을 클릭하면 해당 영상을 바로 확인할 수
                  있습니다.
                </li>
              </ul>
            </div>
            <div className={styles.calendar}>
              <span className={styles.title}>📅 캘린더</span>
              <span className={styles.intro}>
                이상 행동 발생 현황을 달력으로 한눈에 파악하세요.
              </span>
              <ul>
                <li>
                  📊 현황 보기
                  <br /> 달력에서 이상 행동이 발생한 날짜를 직관적으로 확인할 수
                  있습니다.
                </li>
                <li>
                  🗓️ 월별 조회
                  <br /> 원하는 달을 선택해 그 달의 발생 현황을 자세히
                  살펴보세요.
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.guidepage__wrapper__content__right}>
            <div className={styles.cctv}>
              <span className={styles.title}>🎥 CCTV 관리</span>
              <span className={styles.intro}>
                등록된 CCTV를 효율적으로 관리할 수 있습니다.
              </span>
              <ul>
                <li>
                  📋CCTV 목록 확인
                  <br /> 현재 등록된 CCTV를 한눈에 볼 수 있습니다.
                </li>
                <li>
                  ➕CCTV 추가
                  <br /> 최대 10대까지 CCTV를 추가할 수 있습니다.
                </li>
                <li>
                  ℹ️필요 정보
                  <br /> CCTV 등록 시 이름, IP 주소, CCTV ID, 비밀번호, 스트림
                  경로를 입력해주세요.
                </li>
                <li>
                  ✏️정보 수정 및 삭제
                  <br /> 필요 시 CCTV 정보를 수정하거나 삭제할 수 있습니다.
                </li>
              </ul>
            </div>
            <div className={styles.mypage}>
              <span className={styles.title}>👤 마이페이지</span>
              <span className={styles.intro}>
                나만의 설정과 정보를 관리하세요.
              </span>
              <ul>
                <li>
                  🔔 알림 설정
                  <br /> 알림을 켜거나 끌 수 있는 ON/OFF 기능을 제공합니다.
                </li>
                <li>
                  🧑 회원 정보 확인 및 변경
                  <br /> 현재 회원 정보를 간편하게 확인 및 변경할 수 있습니다.
                </li>
                <li>
                  💾 저장 공간 확인
                  <br /> 잔여 저장 공간을 실시간으로 체크할 수 있습니다. <br />
                  공간이 가득 차면 더 이상 저장되지 않으니 주기적으로
                  확인해주세요.
                </li>
                <li>
                  🚪 회원 탈퇴
                  <br /> 서비스를 더 이상 이용하지 않으실 경우, 회원 탈퇴도
                  가능합니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
