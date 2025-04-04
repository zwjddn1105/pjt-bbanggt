from io import BytesIO

from PIL import Image
from fastapi import FastAPI, File
from ultralytics import YOLO
import requests
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


@app.post("/upload-image")
async def upload_image(request: ImageRequest):
    # 1) 업로드된 이미지 파일을 OpenCV용 numpy 배열로 변환
    image_path = request.image_path
    response = requests.get(image_path, timeout=5)
    response.raise_for_status()

    image = Image.open(BytesIO(response.content))

    results = model.predict(image)
    detection_counts = {}

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0].item())  # 클래스 인덱스 (Tensor -> int)
            class_name = model.names.get(cls, f"cls_{cls}")  # 클래스 이름

            detection_counts[class_name] = detection_counts.get(class_name, 0) + 1

    detection_counts_str = ", ".join([f"{k}: {v}" for k, v in detection_counts.items()])

    return {
        "detection_counts": detection_counts_str
    }

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

    detection_counts_str = ", ".join([f"{k}: {v}" for k, v in detection_counts.items()])

    return {
        "detection_counts": detection_counts_str
    }


@app.get("/")
async def first_get():
    return {"message": "안녕하세요! 이곳은 YOLO FastAPI 엔드포인트입니다."}