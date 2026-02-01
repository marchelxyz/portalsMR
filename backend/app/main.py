"""FastAPI application entry point."""

from __future__ import annotations

from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import get_settings
from app.db.init_db import init_db
from app.db.session import SessionLocal


def create_app() -> FastAPI:
    """Create and configure the FastAPI app."""

    settings = get_settings()
    app = FastAPI(title=settings.app_name)
    app.include_router(api_router)

    @app.get("/health")
    def health_check() -> dict[str, str]:
        """Health check endpoint."""

        return {"status": "ok"}

    @app.on_event("startup")
    def startup_init() -> None:
        """Initialize database on startup."""

        with SessionLocal() as session:
            init_db(session)

    return app


app = create_app()
