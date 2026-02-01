"""Database session setup."""

from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings


def get_engine():
    """Create SQLAlchemy engine from settings."""

    settings = get_settings()
    return create_engine(settings.database_url, pool_pre_ping=True)


ENGINE = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)
