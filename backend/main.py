from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.db import Base, engine, get_db
from backend.models import Prompt

ROOT_DIR = Path(__file__).resolve().parent.parent
TEXTS_FILE = ROOT_DIR / "texts.txt"


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)

    db = next(get_db())
    try:
        prompt_count = db.scalar(select(func.count(Prompt.id))) or 0
        has_prompts = prompt_count > 0

        if not has_prompts:
            prompts = [
                Prompt(text=line.strip())
                for line in TEXTS_FILE.read_text(encoding="utf-8").splitlines()
                if line.strip()
            ]
            db.add_all(prompts)
            db.commit()
    finally:
        db.close()

    yield


app = FastAPI(title="Typing Coach API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/api/prompt")
def get_prompt(db: Session = Depends(get_db)):
    prompt = db.scalar(select(Prompt).order_by(func.random()).limit(1))

    if prompt is None:
        return {"text": "No sample text found."}

    return {"id": prompt.id, "text": prompt.text}
