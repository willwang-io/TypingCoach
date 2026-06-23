from pathlib import Path
import random

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Typing Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

ROOT_DIR = Path(__file__).resolve().parent.parent
TEXTS_FILE = ROOT_DIR / "texts.txt"


@app.get("/")
def read_root():
    return {"message": "Typing Coach API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/prompt")
def get_prompt():
    prompts = [
        line.strip()
        for line in TEXTS_FILE.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]

    if not prompts:
        return {"text": "No sample text found in texts.txt."}

    return {"text": random.choice(prompts)}
