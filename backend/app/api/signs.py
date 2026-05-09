from fastapi import APIRouter

router = APIRouter()

# Sign recognition is handled entirely in the browser (onnxruntime-web + mediapipe JS).
# This endpoint is kept as a stub so the router doesn't break.
@router.get("/dictionary")
def get_dictionary():
    return {"signs": []}


@router.get("/dictionary")
def get_dictionary():
    return {"signs": []}