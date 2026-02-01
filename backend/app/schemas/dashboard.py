"""Dashboard schemas."""

from __future__ import annotations

from datetime import date

from pydantic import BaseModel

from app.models.ai_ticket import AiTicketSeverity, AiTicketStatus


class KpiSummary(BaseModel):
    """Top KPI summary for the dashboard."""

    revenue_today: float
    revenue_plan_percent: float
    labor_cost_percent: float
    food_cost_percent: float
    profit_forecast: float
    lfl_percent: float


class AiTicketRead(BaseModel):
    """AI ticket data for the dashboard."""

    id: int
    severity: AiTicketSeverity
    status: AiTicketStatus
    title: str
    body: str
    action_label: str


class WeeklyChartPoint(BaseModel):
    """Weekly chart point."""

    day: date
    revenue: float
    checks: int
