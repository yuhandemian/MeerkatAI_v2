import os
import time
import logging
import torch
import torch.nn.functional as F
import numpy as np
from ultralytics import YOLO

from mymodule.model import LSTMPoseClassifier

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

current_dir = os.path.dirname(os.path.abspath(__file__))
YOLO_MODEL_PATH    = os.path.join(current_dir, 'yolo11s-pose.pt')
CLASSIFIER_PATH    = os.path.join(current_dir, 'yolo11s_model.pth')
CLASS_NAMES        = ["Fall", "Damage", "Fire", "Smoke", "Abandon", "Theft", "Assault", "Normal"]

THRESHOLDS = {
    'Fall':    0.75,
    'Damage':  0.75,
    'Fire':    0.90,
    'Smoke':   0.90,
    'Abandon': 0.75,
    'Theft':   0.70,
    'Assault': 0.75,
}

DEFAULT_THRESHOLD = 0.5
CONFIDENCE_MARGIN = 0.15

enabled_yolo     = None
classifier       = None
classifier_device = None

def load_pose_model():
    global enabled_yolo
    if enabled_yolo is None:
        if not os.path.exists(YOLO_MODEL_PATH):
            logger.error(f"YOLO 모델을 찾을 수 없습니다: {YOLO_MODEL_PATH}")
            return None
        enabled_yolo = YOLO(YOLO_MODEL_PATH)
        logger.info(f"YOLO 포즈 모델 로드: {YOLO_MODEL_PATH}")
    return enabled_yolo

def load_classifier():
    global classifier, classifier_device
    if classifier is not None:
        return classifier, classifier_device

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    if not os.path.exists(CLASSIFIER_PATH):
        logger.error(f"분류기 가중치를 찾을 수 없습니다: {CLASSIFIER_PATH}")
        return None, device

    classifier = LSTMPoseClassifier(input_size=34,
                                    hidden_size=128,
                                    num_layers=2,
                                    num_classes=len(CLASS_NAMES))
    classifier.load_state_dict(torch.load(CLASSIFIER_PATH, map_location=device))
    classifier = classifier.to(device).eval()
    classifier_device = device
    logger.info(f"LSTM 분류기 로드: {CLASSIFIER_PATH} ({device})")
    return classifier, device

def extract_keypoints_from_frame(frame):
    pose = load_pose_model()
    if pose is None:
        return None
    try:
        res = pose(frame)[0]
        if res.keypoints is None or len(res.keypoints.xy) == 0:
            return None
        
        if len(res.keypoints.xy) > 1:
            boxes = res.boxes.xyxy.cpu().numpy()
            areas = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
            idx = np.argmax(areas)
            kp = res.keypoints.xy[idx].cpu().numpy().flatten()
        else:
            kp = res.keypoints.xy[0].cpu().numpy().flatten()
        
        h, w = frame.shape[:2]
        kp[0::2] /= w
        kp[1::2] /= h
        
        if kp.shape[0] != 34:
            return None
        
        if np.any(np.isnan(kp)) or np.any(np.isinf(kp)):
            logger.warning("키포인트에 NaN 또는 Inf 값 감지")
            return None
        
        if np.any((kp < -0.1) | (kp > 1.1)):
            logger.warning(f"키포인트 값이 범위를 벗어남: min={kp.min():.3f}, max={kp.max():.3f}")
            return None
        
        return kp
    except Exception as e:
        logger.error(f"키포인트 추출 오류: {e}")
        return None

def classify_sequence(seq):
    model, device = load_classifier()
    if model is None:
        return None, 0.0, None

    with torch.no_grad():
        x = torch.FloatTensor(seq).unsqueeze(0).to(device)
        logits = model(x)
        probs = F.softmax(logits, dim=1)[0].cpu().numpy()
        idx  = int(np.argmax(probs))
        conf = float(probs[idx])
        return idx, conf, probs

def advanced_theft_detection_model(frame, buffer, min_length=45):
    start = time.time()
    kp = extract_keypoints_from_frame(frame)
    if kp is not None:
        buffer.append(kp)
    else:
        return False, 0.0, None

    if len(buffer) < min_length:
        return False, 0.0, None

    seq = np.array(list(buffer)[-min_length:])
    idx, conf, probs = classify_sequence(seq)
    elapsed = time.time() - start

    behavior  = CLASS_NAMES[idx]
    threshold = THRESHOLDS.get(behavior, DEFAULT_THRESHOLD)
    normal_idx = CLASS_NAMES.index("Normal")
    normal_conf = float(probs[normal_idx])

    is_anomaly = idx != normal_idx and conf >= threshold and (conf - normal_conf) > CONFIDENCE_MARGIN
    
    if is_anomaly:
        logger.info(f"⚠️ {behavior} 감지 - 신뢰도: {conf:.3f}, Normal: {normal_conf:.3f}, 처리시간: {elapsed:.3f}s")
        return True, conf, behavior
    else:
        logger.debug(f"정상 행동 - 클래스: {behavior}, 신뢰도: {conf:.3f}, Normal: {normal_conf:.3f}")
        return False, conf, None

def theft_detection_model(frame, buffer):
    return advanced_theft_detection_model(frame, buffer)
