import React, { useState } from "react";
import styles from "./TermContent.module.scss";

export default function TermContent({ isClickLeft }) {
  const [isLeft, setIsLeft] = useState(isClickLeft);
  return (
    <div className={styles.termwrapper}>
      <div className={styles.termwrapper__menu}>
        <button
          className={`${styles.termwrapper__menu__button} ${
            isLeft ? styles.active : styles.inactive
          }`}
          onClick={() => setIsLeft(true)}
        >
          최종사용자 이용 약관
        </button>
        <button
          className={`${styles.termwrapper__menu__button} ${
            !isLeft ? styles.active : styles.inactive
          }`}
          onClick={() => setIsLeft(false)}
        >
          개인정보 수집 및 이용 동의 약관
        </button>
      </div>
      {isLeft ? (
        <div className={styles.termwrapper__text}>
          <section class="section-content">
            <div class="section-title">제1조 (목적)</div>
            <p>
              이 약관은 [회사명] (이하 "회사")가 제공하는 무인점포 CCTV 기반
              이상행동 감지 및 알림 서비스(이하 "서비스")의 이용과 관련하여,
              회사와 최종 이용자(이하 "이용자") 간의 권리, 의무 및 책임사항을
              정함을 목적으로 합니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제2조 (용어의 정의)</div>
            <p>
              "서비스"란 회사가 운영하는 무인점포 CCTV 이상행동 감지 및 알림
              플랫폼을 의미합니다. "이용자"란 본 약관에 동의하고 회사가 제공하는
              서비스를 이용하는 자를 말합니다. "이상행동"이란 사람이 일반적인
              행위 패턴에서 벗어난 동작으로, 관리자 주의가 필요한 상태를
              말합니다. "GPU 서버"란 이상행동 감지를 위한 딥러닝 기반 영상
              분석을 수행하는 회사의 고성능 연산 서버를 의미합니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제3조 (약관의 효력 및 변경)</div>
            <p>
              본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.
              회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며,
              변경 시 웹사이트 또는 애플리케이션 내 공지사항을 통해 사전
              공지합니다. 변경된 약관에 동의하지 않을 경우, 이용자는 서비스
              이용을 중단하고 탈퇴할 수 있습니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제4조 (서비스의 내용 및 제공)</div>
            <ul>
              <li>무인점포 CCTV 영상 실시간 분석 및 이상행동 감지</li>
              <li>이상행동 발생 시 이메일 또는 앱 푸시 등으로 알림 전송</li>
              <li>감지된 영상 및 분석 결과 저장 및 사용자 확인 기능 이용</li>
              <li>통계, 서비스 개선 목적의 데이터 분석</li>
              <li>기타 회사가 정하는 부가 서비스</li>
            </ul>
          </section>

          <section class="section-content">
            <div class="section-title">제5조 (서비스 이용 조건)</div>
            <p>
              이용자는 서비스 제공에 필요한 정보를 정확히 입력하여야 합니다.
              이용자는 본인의 CCTV RTSP 주소와 위치 정보를 회사에 제공해야 하며,
              잘못된 정보 제공 시 발생하는 문제에 대한 책임은 이용자에게
              있습니다. 이용자는 회사가 제공하는 서비스를 비정상적으로
              사용하거나, 불법적인 목적으로 사용해서는 안 됩니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제6조 (회사의 의무)</div>
            <p>
              회사는 안정적인 서비스 제공을 위해 최선을 다합니다. 회사는 수집된
              개인정보 및 CCTV 영상을 적절히 보호하기 위해 기술적/관리적 보안
              조치를 취합니다. 회사는 관련 법령에 따라 사용자 데이터를 처리하며,
              무단으로 외부에 제공하지 않습니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제7조 (이용자의 의무)</div>
            <p>
              이용자는 본 약관 및 관련 법령을 준수해야 합니다. 타인의 개인정보를
              도용하거나, 시스템에 무단 접근하는 등의 행위를 하여서는 안 됩니다.
              이용자는 서비스 이용 중 발생한 이상행동 영상 및 데이터를 무단으로
              배포하거나, 외부 유출하지 않아야 합니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제8조 (영상 저장 및 보관 정책)</div>
            <p>
              이상행동 감지 시 저장되는 CCTV 영상은 최대 30일 동안 보관되며, 그
              이후 자동으로 삭제됩니다. 이용자는 본인의 영상 데이터에 대해
              삭제를 요청할 수 있으며, 회사는 지체 없이 이를 수행합니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제9조 (서비스 이용의 제한 및 종료)</div>
            <p>
              이용자가 본 약관을 위반할 경우 회사는 서비스 이용을 제한하거나
              회원 자격을 정지 또는 탈퇴시킬 수 있습니다. 이용자는 언제든지
              서비스 이용을 중단하고 탈퇴할 수 있습니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제10조 (면책 조항)</div>
            <p>
              회사는 천재지변, 서버 장애, 네트워크 문제 등 불가항력적인 사유로
              인한 서비스 중단에 대해 책임을 지지 않습니다. 이상행동 감지의
              정확도는 AI 모델 성능에 따라 달라질 수 있으며, 감지 오류로 인한
              손해에 대해서는 회사의 고의 또는 중대한 과실이 없는 한 책임을 지지
              않습니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제11조 (지식재산권)</div>
            <p>
              서비스 내 제공되는 콘텐츠(영상, UI, 모델 등)에 대한 지식재산권은
              회사에 귀속되며, 이용자는 회사의 사전 동의 없이 이를 복제, 배포,
              수정할 수 없습니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">제12조 (관할법원 및 준거법)</div>
            <p>
              본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련된
              분쟁은 회사의 본사 소재지를 관할하는 법원을 제1심 관할법원으로
              합니다.
            </p>
          </section>
        </div>
      ) : (
        <div className={styles.termwrapper__text}>
          <section class="section-content">
            <p>
              회사는 『개인정보 보호법』 등 관련 법령에 따라 이용자의 개인정보를
              안전하게 보호하고, 적법하게 처리하기 위해 다음과 같은 내용으로
              개인정보를 수집 및 이용하고자 합니다. 아래의 내용을 충분히
              읽어보신 후 동의 여부를 결정해주시기 바랍니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">1. 수집하는 개인정보 항목</div>
            <ul>
              <li>
                이름, 이메일 주소: 사용자 식별 및 이상행동 발생 시 알림 전송
              </li>
              <li>
                CCTV RTSP 주소, 위치 정보: CCTV 영상 수신 및 모니터링 대상 구분
              </li>
              <li>
                이상행동 감지 영상 및 분석 로그: 알림 발송, 사용자 확인 기능
                제공, 이상행동 분석 고도화
              </li>
            </ul>
          </section>

          <section class="section-content">
            <div class="section-title">2. 수집 및 이용 목적</div>
            <ul>
              <li>무인점포 내 이상행동 감지를 위한 실시간 영상 분석</li>
              <li>이상행동 발생 시 사용자에게 알림 전송 (이메일 등)</li>
              <li>감지된 이상행동 영상의 저장 및 사용자 확인 기능 제공</li>
              <li>시스템 오류 및 보안 로그 기록</li>
              <li>서비스 품질 향상 및 사용자 맞춤형 기능 제공</li>
              <li>법적 의무 이행 및 민원 처리</li>
            </ul>
          </section>

          <section class="section-content">
            <div class="section-title">3. 보유 및 이용 기간</div>
            <ul>
              <li>사용자 정보 (이름, 이메일): 회원 탈퇴 시 즉시 파기</li>
              <li>
                이상행동 감지 영상: 저장일로부터 최대 30일 이내 자동 삭제 또는
                이용자 요청 시 즉시 삭제
              </li>
              <li>
                CCTV RTSP 주소 및 위치: 서비스 종료 또는 회원 탈퇴 시 즉시 파기
              </li>
            </ul>
          </section>

          <section class="section-content">
            <div class="section-title">4. 개인정보 제공 및 처리 위탁</div>
            <p>
              회사는 이용자의 개인정보를 외부에 제공하지 않으며, 이상행동 감지
              및 알림 서비스 제공을 위해 다음과 같이 영상 데이터를 제3자 서버로
              전송할 수 있습니다.
            </p>
            <ul>
              <li>이상행동 감지를 위한 RTSP 기반 실시간 영상 스트리밍 처리</li>
              <li>
                해당 서버는 회사 내부 보안 통제 하에 운용되며, 분석 후 필요한
                정보만 저장됩니다.
              </li>
            </ul>
          </section>

          <section class="section-content">
            <div class="section-title">5. 동의 거부 시 불이익</div>
            <p>
              이용자는 개인정보 수집 및 이용에 동의하지 않을 권리가 있습니다.
              단, 필수 항목에 대한 동의를 거부할 경우 서비스 제공이 불가능할 수
              있습니다.
            </p>
          </section>

          <section class="section-content">
            <div class="section-title">6. 기타 안내</div>
            <ul>
              <li>
                본 동의서는 서비스 이용을 위한 최소한의 개인정보 수집 및 이용에
                대한 안내입니다.
              </li>
              <li>
                이용자는 언제든지 열람, 정정, 삭제, 처리정지 등의 권리를 행사할
                수 있으며, 고객센터 또는 개인정보보호책임자를 통해 요청
                가능합니다.
              </li>
            </ul>
          </section>

          <section class="section-content">
            <div class="section-title">7. 개인정보 보호책임자</div>
            <ul>
              <li>성명: [책임자 이름]</li>
              <li>직책: 개인정보 보호책임자</li>
              <li>연락처: [이메일 / 전화번호]</li>
              <li>문의처: [회사명] 고객센터 또는 이메일 문의</li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
