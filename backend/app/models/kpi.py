"""Daily KPI model."""

from __future__ import annotations

from datetime import date

from sqlalchemy import Date, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class KpiDaily(Base):
    """Represents daily KPI metrics for an outlet."""

    __tablename__ = "kpis_daily"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    outlet_id: Mapped[int] = mapped_column(ForeignKey("outlets.id"), nullable=False)
    day: Mapped[date] = mapped_column(Date, nullable=False)
    revenue: Mapped[float] = mapped_column(Float, nullable=False)
    plan_percent: Mapped[float] = mapped_column(Float, nullable=False)
    labor_cost_percent: Mapped[float] = mapped_column(Float, nullable=False)
    food_cost_percent: Mapped[float] = mapped_column(Float, nullable=False)
    profit_forecast: Mapped[float] = mapped_column(Float, nullable=False)
    checks: Mapped[int] = mapped_column(Integer, nullable=False)
    lfl_percent: Mapped[float] = mapped_column(Float, nullable=False)

    outlet = relationship("Outlet", back_populates="kpis")
