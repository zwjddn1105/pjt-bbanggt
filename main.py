from io import BytesIO

from PIL import Image
from fastapi import FastAPI, File
from ultralytics import YOLO
from pydantic import BaseModel

app = FastAPI()

class ImageRequest(BaseModel):
    image_path: str

# 모델 로드 (예외 감싸보기)
try:
    model = YOLO("./20250327_best_model.pt")  # 가중치 경로
    print("✅ YOLO 모델 로드 성공")
except Exception as e:
    print("❌ YOLO 모델 로드 실패:", e)
    model = None  # 모델 로드 실패 시 None 처리

@app.post("/predict2")
async def predict_image(file: bytes = File(...)):
    image = Image.open(BytesIO(file))
    results = model.predict(image)
    detection_counts = {}

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0].item())  # 클래스 인덱스 (Tensor -> int)
            class_name = model.names.get(cls, f"cls_{cls}")  # 클래스 이름

            detection_counts[class_name] = detection_counts.get(class_name, 0) + 1

    # detection_counts를 BreadClassificationResponse 형태에 맞춰서 변환
    breads_list = []
    for class_name, count in detection_counts.items():
        breads_list.append({
            "classification": class_name,
            "stock": count
        })

    # 최종 응답 구조
    response = {
        "breads": breads_list
    }

    return response
