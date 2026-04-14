# 무인점포 이상행동 감지 시스템 - README

## 📋 시스템 개요

실시간 CCTV 영상을 분석하여 무인점포에서 발생할 수 있는 8가지 이상행동을 감지하고 자동으로 녹화하는 시스템입니다.

### 주요 기능
- **실시간 행동 감지**: Theft, Assault, Damage, Fire, Smoke, Fall, Abandon, Normal
- **자동 녹화**: 이상행동 감지 시 40초 자동 녹화
- **스마트 필터링**: 잘못된 감지(False Positive) 자동 필터링 및 삭제
- **클라우드 업로드**: S3 자동 업로드 및 API 알림

### 아키텍처
```
CCTV 영상 → YOLO11s-pose (키포인트 추출) → LSTM (행동 분류) → 녹화/알림
```

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
pip install -r requirements.txt
```

### 2. 설정 파일 수정
`config.yaml` 파일에서 S3 및 API 설정을 수정하세요:
```yaml
s3:
  bucket: "your-bucket-name"
  region: "ap-northeast-2"

api:
  url: "http://your-api-server.com"
```

### 3. 실행
```bash
python main.py
```

## 📁 프로젝트 구조

```
.
├── main.py                                    # FastAPI 서버 및 메인 로직
├── config.yaml                                # 설정 파일
├── requirements.txt                           # Python 의존성
├── mymodule/
│   ├── advanced_theft_detection_model.py    # 실시간 감지 모델
│   ├── model.py                              # LSTM 모델 정의
│   ├── utils_s3.py                           # S3 유틸리티
│   ├── utils_api.py                          # API 유틸리티
│   ├── yolo11s-pose.pt                       # YOLO pose 모델
│   └── yolo11s_model.pth                     # LSTM 분류 모델
└── recordings/                                # 녹화 파일 저장 디렉토리
    └── thumbnails/                           # 썸네일 저장
```

## 🔧 주요 설정

### 감지 임계값 (config.yaml)
```yaml
thresholds:
  theft: 0.70      # 절도
  assault: 0.75    # 폭행
  fall: 0.75       # 낙상
  fire: 0.90       # 화재
  smoke: 0.90      # 연기
```

### 버퍼 크기 (config.yaml)
```yaml
buffer:
  frame_buffer_size: 60          # 2초 (30fps)
  keypoints_buffer_size: 120     # 4초 (30fps)
```

### 녹화 설정 (config.yaml)
```yaml
recording:
  duration: 40                    # 녹화 길이 (초)
  min_detection_count: 2          # 최소 감지 횟수
  max_detection_gap: 15.0         # 최대 감지 간격 (초)
```

## 🔍 주요 파일 설명

### main.py
FastAPI 서버와 CCTV 모니터링 로직을 포함합니다.

**주요 클래스:**
- `CCTVMonitor`: CCTV 스트림 모니터링 및 녹화 관리
  - `process_frame()`: 프레임별 이상행동 감지 (main.py:405)
  - `start_recording()`: 녹화 시작 (main.py:476)
  - `stop_recording()`: 녹화 종료 및 S3 업로드 (main.py:545)

**주요 API 엔드포인트:**
- `POST /start`: CCTV 모니터링 시작
- `POST /stop`: CCTV 모니터링 종료
- `GET /status`: 현재 상태 조회

### mymodule/advanced_theft_detection_model.py
실시간 행동 감지를 수행하는 핵심 모듈입니다.

**주요 함수:**
- `load_pose_model()`: YOLO11s-pose 모델 로드 (line 39)
- `load_classifier()`: LSTM 분류 모델 로드 (line 51)
- `extract_keypoints()`: 프레임에서 키포인트 추출 (line 69)
- `classify_sequence()`: 시퀀스 분류 (line 113)
- `advanced_theft_detection_model()`: 통합 감지 함수 (line 126)

### mymodule/model.py
LSTM 모델 정의를 포함합니다.

**클래스:**
- `LSTMClassifier`: 행동 분류를 위한 LSTM 모델
  - Input: (batch_size, sequence_length, 34)
  - Output: (batch_size, 8) - 8개 클래스 확률

## 📊 성능 최적화

### 1. 샘플링 간격 조정
프레임 처리 부하를 줄이려면 `config.yaml`의 `sampling_interval`을 증가시키세요:
```yaml
detection:
  sampling_interval: 15  # 10 → 15 (CPU 부하 33% 감소)
```

### 2. 버퍼 크기 조정
메모리 사용량을 줄이려면 버퍼 크기를 감소시키세요:
```yaml
buffer:
  frame_buffer_size: 45      # 60 → 45
  keypoints_buffer_size: 90  # 120 → 90
```

### 3. GPU 사용
CUDA가 설치된 환경에서는 자동으로 GPU를 사용합니다.

## ⚠️ 주의사항

### 1. 모델 재학습 시 주의점
- 키포인트는 반드시 정규화해야 합니다 (0~1 범위)
- 키포인트 추출 실패 시 제로 패딩 대신 프레임을 건너뛰세요
- 여러 사람이 있을 경우 가장 큰 bounding box를 선택하세요

### 2. 녹화 삭제 조건
다음 조건을 만족하지 못하면 녹화 파일이 자동 삭제됩니다:
- 최소 2회 이상 감지
- 감지 간격 15초 이하
- 평균 신뢰도 0.65 이상

### 3. 쿨다운 시간
한 번 감지 후 45초간은 새로운 녹화가 시작되지 않습니다.

## 🐛 트러블슈팅

### Q1. "실제 CCTV에서 분류가 잘 안됨"
**원인**: 모델이 정규화되지 않은 데이터로 학습되었을 수 있습니다.
**해결**: 
1. `mymodule/advanced_theft_detection_model.py`의 `extract_keypoints()` 함수에서 정규화가 수행되는지 확인
2. 학습 데이터도 동일한 방식으로 정규화되었는지 확인
3. 필요시 모델 재학습

### Q2. "녹화 파일이 자동 삭제됨"
**원인**: 감지 조건이 너무 엄격합니다.
**해결**: `config.yaml`에서 조건을 완화하세요:
```yaml
recording:
  min_detection_count: 2     # 3 → 2
  max_detection_gap: 20.0    # 15 → 20
```

### Q3. "CPU 사용률이 너무 높음"
**원인**: 샘플링 간격이 너무 짧습니다.
**해결**: `config.yaml`에서 간격을 늘리세요:
```yaml
detection:
  sampling_interval: 15  # 10 → 15
```

### Q4. "메모리 부족 에러"
**원인**: 버퍼 크기가 너무 큽니다.
**해결**: `config.yaml`에서 버퍼 크기를 줄이세요:
```yaml
buffer:
  frame_buffer_size: 45
  keypoints_buffer_size: 90
```

## 📝 로그 분석

### 로그 레벨
- `INFO`: 정상 동작 (녹화 시작/종료, 이상행동 감지)
- `WARNING`: 주의 필요 (키포인트 추출 실패, 신뢰도 낮음)
- `ERROR`: 오류 발생 (모델 로드 실패, S3 업로드 실패)

### 주요 로그 메시지
```
⚠️ Theft 감지 (신뢰도: 0.85)          # 이상행동 감지
[1] 녹화 시작: recordings/1_*.mp4     # 녹화 시작
[1] 녹화 완료 및 S3 업로드 시작        # 녹화 종료
S3 업로드 성공: s3://bucket/...       # 업로드 성공
```

## 🔗 관련 링크

- YOLO11s-pose: https://docs.ultralytics.com/models/yolo11/
- PyTorch LSTM: https://pytorch.org/docs/stable/generated/torch.nn.LSTM.html

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
