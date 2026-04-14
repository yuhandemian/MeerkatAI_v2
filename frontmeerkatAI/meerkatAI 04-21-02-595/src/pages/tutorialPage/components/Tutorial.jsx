// Tutorial.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Tutorial.module.scss";

const Tutorial = ({
  steps,
  isEnabled = false,
  onComplete = () => {},
  routePath = null, // 특정 경로에서만 활성화할 경우 지정
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState(null);

  const targetRefs = useRef([]);
  const location = useLocation();

  // 경로 확인 및 튜토리얼 활성화
  useEffect(() => {
    if (routePath && location.pathname === routePath) {
      if (isEnabled) {
        setIsActive(true);
      }
    } else if (!routePath && isEnabled) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location.pathname, routePath, isEnabled]);

  // 각 단계별 요소 위치 및 크기 계산
  useEffect(() => {
    if (isActive && steps.length > 0) {
      const currentTarget = steps[currentStep].target;
      console.log(currentTarget);
      // DOM 요소 찾기

      requestAnimationFrame(() => {
        if (typeof currentTarget === "string") {
          const element = document.querySelector(currentTarget);
          if (element) {
            targetRefs.current[currentStep] = element;
            const rect = element.getBoundingClientRect();
            setPosition({
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            });
          }
        }
      });
    }
  }, [currentStep, isActive, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 튜토리얼 완료
      setIsActive(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    onComplete();
  };

  if (!isActive) return null;

  return (
    <div className={styles.tutorial_overlay}>
      <div className={styles.tutorial_backdrop}></div>

      {position && (
        <>
          {/* 타겟 요소 주위에 포커스 영역 생성 */}
          <div
            className={styles.tutorial_focus}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              height: `${position.height}px`,
            }}
          ></div>

          {/* 툴팁 */}
          <div
            className={styles.tutorial_tooltip}
            style={{
              top: `${position.top}px`,
              left: `${position.left + position.width + 10}px`,
            }}
          >
            <div className={styles.tutorial_tooltip_content}>
              <h3>{steps[currentStep].title}</h3>
              <p>{steps[currentStep].description}</p>

              <div className={styles.tutorial_controls}>
                <button className={styles.tutorial_skip} onClick={handleSkip}>
                  건너뛰기
                </button>
                <div className={styles.tutorial_progress}>
                  {steps.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.progress_dot} ${
                        index === currentStep ? styles.active : ""
                      }`}
                    />
                  ))}
                </div>
                <button className={styles.tutorial_next} onClick={handleNext}>
                  {currentStep === steps.length_1 ? "완료" : "다음"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tutorial;
