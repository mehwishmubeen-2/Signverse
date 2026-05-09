# ML inference has been moved to the browser (onnxruntime-web + mediapipe JS).
# This module is intentionally empty to avoid heavy dependency imports on startup.


_BASE = Path(__file__).parent
_MODEL_PATH = _BASE / "asl_rf_model.onnx"
_LABELS_PATH = _BASE / "labels.json"

with open(_LABELS_PATH) as f:
    _labels_data = json.load(f)
LABEL_MAP: dict[str, str] = _labels_data["label_map"]

_session = rt.InferenceSession(str(_MODEL_PATH))
_input_name = _session.get_inputs()[0].name

_mp_hands = mp.solutions.hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5,
)

def _extract_features(image_bgr: np.ndarray):
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    results = _mp_hands.process(image_rgb)
    if not results.multi_hand_landmarks:
        return None
    landmarks = results.multi_hand_landmarks[0].landmark
    x_coords = [lm.x for lm in landmarks]
    y_coords = [lm.y for lm in landmarks]
    x_min, y_min = min(x_coords), min(y_coords)
    x_max, y_max = max(x_coords), max(y_coords)
    bbox_w = (x_max - x_min) or 1e-6
    bbox_h = (y_max - y_min) or 1e-6
    # Bounding-box scale-normalized x, y + raw z (matches training preprocessing)
    features: list[float] = []
    for lm in landmarks:
        features.append((lm.x - x_min) / bbox_w)
        features.append((lm.y - y_min) / bbox_h)
        features.append(lm.z)
    return np.array(features, dtype=np.float32).reshape(1, -1)

def predict(image_bgr: np.ndarray) -> dict:
    features = _extract_features(image_bgr)
    if features is None:
        return {"label": "No hand detected", "confidence": 0.0, "detected": False}
    # Debug: log feature stats to see if values are in expected range
    import sys
    print(f"[ML DEBUG] features shape={features.shape} min={features.min():.4f} max={features.max():.4f} mean={features.mean():.4f}", file=sys.stderr)
    outputs = _session.run(None, {_input_name: features})
    predicted_class = int(outputs[0][0])
    label = LABEL_MAP.get(str(predicted_class), "Unknown")
    confidence = 1.0
    if len(outputs) > 1:
        try:
            prob_dict = outputs[1][0]
            if isinstance(prob_dict, dict):
                confidence = float(max(prob_dict.values()))
            else:
                confidence = float(np.max(prob_dict))
        except Exception:
            pass
    print(f"[ML DEBUG] predicted class={predicted_class} label={label} confidence={confidence:.4f}", file=sys.stderr)
    return {"label": label, "confidence": round(confidence * 100, 1), "detected": True}