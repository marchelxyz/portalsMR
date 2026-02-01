"""FastAPI application entry point."""

from __future__ import annotations

import logging
import time

from fastapi import FastAPI
from sqlalchemy.exc import SQLAlchemyError

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

        _init_db_with_retry()

    return app


app = create_app()


def _init_db_with_retry(max_attempts: int = 5, delay_seconds: float = 2.0) -> None:
    """Attempt database initialization with retries."""

    logger = logging.getLogger("portal.backend")
    for attempt in range(1, max_attempts + 1):
        try:
            _try_init_db()
            logger.info("Database initialized successfully.")
            return
        except SQLAlchemyError as exc:
            logger.warning(
                "Database init failed (%s/%s): %s",
                attempt,
                max_attempts,
                exc,
            )
        time.sleep(delay_seconds)

    logger.error("Database init failed after retries. Continuing without DB.")


def _try_init_db() -> None:
    """Run the database initialization once."""

    with SessionLocal() as session:
        init_db(session)
