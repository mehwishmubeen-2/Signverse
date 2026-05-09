from fastapi import APIRouter, UploadFile, File

router = APIRouter()


@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    # TODO: pass audio to Whisper or SpeechRecognition
    return {"transcript": "placeholder"}
