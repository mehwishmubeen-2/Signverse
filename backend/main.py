from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.Chatbot import router as chatbot_router

from app.api import auth

app = FastAPI(title="SignVerse API", version="1.0.0")

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chatbot_router, prefix="/chatbot", tags=["chatbot"])  # ← ADD THIS



@app.get("/")
def root():
    return {"message": "SignVerse API is running"}
