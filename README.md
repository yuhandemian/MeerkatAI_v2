# MeerkatAI_v2

무인점포 CCTV 영상을 분석해 이상행동을 감지하고, 웹 대시보드에서 CCTV·영상·알림 정보를 관리하는 프로젝트입니다.

## 구성

- `frontmeerkatAI`: React + Vite 기반 프론트엔드
- `Back/meerkatai`: Spring Boot 기반 백엔드 API 서버
- `AI`: FastAPI 기반 이상행동 감지 및 녹화 서버

## 주요 기능

- CCTV 목록 및 정보 관리
- 이상행동 감지 영상 조회 및 저장
- 사용자 인증 및 마이페이지 기능
- 챗봇 기반 요약/질의 기능
- AI 서버의 감지 결과를 S3 및 백엔드와 연동

## 실행 순서

1. `AI` 서버 실행
2. `Back/meerkatai` 서버 실행
3. `frontmeerkatAI` 실행

## 참고

- 프론트 기본 API 주소는 로컬 백엔드(`http://localhost:8080/api/v1`) 기준입니다.
- 백엔드는 MySQL, JWT, S3, Dialogflow 설정이 필요합니다.
