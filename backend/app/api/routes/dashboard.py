"""Dashboard endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.ai_ticket import AiTicket
from app.models.kpi import KpiDaily
from app.schemas.dashboard import AiTicketRead, KpiSummary

router = APIRouter()


@router.get("/kpis", response_model=KpiSummary)
def get_kpis(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> KpiSummary:
    """Return latest KPI summary."""

    kpi = db.scalar(select(KpiDaily).order_by(desc(KpiDaily.day)))
    if kpi is None:
        return KpiSummary(
            revenue_today=0,
            revenue_plan_percent=0,
            labor_cost_percent=0,
            food_cost_percent=0,
            profit_forecast=0,
            lfl_percent=0,
        )

    return KpiSummary(
        revenue_today=kpi.revenue,
        revenue_plan_percent=kpi.plan_percent,
        labor_cost_percent=kpi.labor_cost_percent,
        food_cost_percent=kpi.food_cost_percent,
        profit_forecast=kpi.profit_forecast,
        lfl_percent=kpi.lfl_percent,
    )


@router.get("/ai-tickets", response_model=list[AiTicketRead])
def get_ai_tickets(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> list[AiTicketRead]:
    """Return AI tickets for the dashboard."""

    tickets = db.scalars(select(AiTicket).order_by(desc(AiTicket.id))).all()
    return [
        AiTicketRead(
            id=ticket.id,
            severity=ticket.severity,
            status=ticket.status,
            title=ticket.title,
            body=ticket.body,
            action_label=ticket.action_label,
        )
        for ticket in tickets
    ]
