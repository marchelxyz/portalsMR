"""API router registration."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.routes import auth, charts, dashboard, franchise

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(franchise.router, prefix="/franchise", tags=["franchise"])
api_router.include_router(charts.router, prefix="/charts", tags=["charts"])
