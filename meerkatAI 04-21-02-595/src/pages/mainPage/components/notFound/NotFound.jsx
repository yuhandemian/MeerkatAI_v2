import React from "react";
import styles from "./NotFound.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg
            viewBox="0 0 240 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="40"
              y="30"
              width="160"
              height="100"
              rx="8"
              fill="#EAEAEA"
              stroke="#CCCCCC"
              strokeWidth="2"
            />

            <rect x="50" y="40" width="140" height="80" rx="4" fill="#F5F5F5" />

            <g transform="translate(95, 65)" opacity="0.7">
              <path d="M40 10L50 0V30L40 20V10Z" fill="#CCCCCC" />
              <rect x="0" y="0" width="40" height="30" rx="4" fill="#CCCCCC" />
              <circle cx="20" cy="15" r="8" fill="#F5F5F5" />
              <circle cx="20" cy="15" r="4" fill="#E0E0E0" />
            </g>

            <line
              x1="70"
              y1="60"
              x2="170"
              y2="100"
              stroke="#CCCCCC"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="70"
              y1="100"
              x2="170"
              y2="60"
              stroke="#CCCCCC"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            <path d="M120 130V140" stroke="#CCCCCC" strokeWidth="4" />
            <rect
              x="100"
              y="140"
              width="40"
              height="10"
              rx="4"
              fill="#EAEAEA"
              stroke="#CCCCCC"
              strokeWidth="2"
            />

            <circle cx="120" cy="80" r="15" fill="#EAEAEA" opacity="0.5" />
            <path d="M115 73L130 80L115 87V73Z" fill="#CCCCCC" opacity="0.5" />

            <text
              x="185"
              y="55"
              fontFamily="Arial"
              fontSize="24"
              fontWeight="bold"
              fill="#CCCCCC"
            ></text>
          </svg>
        </div>
        <p className={styles.message}>표시할 영상이 없습니다</p>
      </div>
    </div>
  );
}
