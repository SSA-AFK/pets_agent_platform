import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

_backend_dir = Path(__file__).resolve().parent.parent.parent
_dotenv_path = _backend_dir / ".env"
if _dotenv_path.exists():
    load_dotenv(_dotenv_path)
else:
    _project_root = _backend_dir.parent
    _root_dotenv = _project_root / ".env"
    if _root_dotenv.exists():
        load_dotenv(_root_dotenv)

from .routes.kb import router as kb_router
from .routes.chat import router as chat_router
from .database import init_db, seed_default_data

app = FastAPI(title="Pet Smart System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()
    await seed_default_data()

app.include_router(kb_router)
app.include_router(chat_router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Pet Smart System API is running"}
