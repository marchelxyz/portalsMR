"""Chart endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.kpi import KpiDaily
from app.schemas.dashboard import WeeklyChartPoint

router = APIRouter()


@router.get("/weekly", response_model=list[WeeklyChartPoint])
def get_weekly_chart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> list[WeeklyChartPoint]:
    """Return weekly revenue and checks data."""

    rows = db.scalars(select(KpiDaily).order_by(desc(KpiDaily.day)).limit(7)).all()
    rows = list(reversed(rows))
    return [
        WeeklyChartPoint(day=row.day, revenue=row.revenue, checks=row.checks)
        for row in rows
    ]
