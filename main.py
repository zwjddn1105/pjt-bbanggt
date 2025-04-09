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
    model = YOLO("./bad_bread_practice.pt")  # 가중치 경로
    print("✅ YOLO 모델 로드 성공")
except Exception as e:
    print("❌ YOLO 모델 로드 실패:", e)
    model = None  # 모델 로드 실패 시 None 처리

@app.post("/predict2")
async def predict_image(file: bytes = File(...)):
    image = Image.open(BytesIO(file))
    results = model.predict(image, conf=0.8)

    contains_bad_bread = False
    for result in results:
        if len(result.boxes) != 0:
            contains_bad_bread = True
            break

    response = {
        "containsBadBread": contains_bad_bread
    }

    return response
