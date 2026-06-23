# Typing Coach

Minimal FastAPI + React + TypeScript + Vite + Tailwind setup.

## Backend

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8001
```

## Frontend

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.
