"""Database initialization and seed data."""

from __future__ import annotations

from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import get_password_hash
from app.models.ai_ticket import AiTicket, AiTicketSeverity, AiTicketStatus
from app.models.base import Base
from app.models.franchise_debt import FranchiseDebt
from app.models.kpi import KpiDaily
from app.models.outlet import Outlet
from app.models.partner import Partner
from app.models.user import User


def init_db(session: Session) -> None:
    """Create tables and seed demo data when empty."""

    Base.metadata.create_all(bind=session.get_bind())
    settings = get_settings()
    if _has_users(session):
        _ensure_seed_user_email(session, settings.seed_user_email)
        return
    partner = Partner(name=settings.seed_partner_name)
    outlet = Outlet(
        name=settings.seed_outlet_name,
        external_id="OUT-001",
        partner=partner,
    )
    user = User(
        email=settings.seed_user_email,
        full_name=settings.seed_user_full_name,
        hashed_password=get_password_hash(settings.seed_user_password),
        partner=partner,
    )
    session.add_all([partner, outlet, user])
    session.flush()

    session.add(
        FranchiseDebt(
            outlet_id=outlet.id,
            royalty_due=80000,
            marketing_due=60000,
            supplies_due=120000,
            qsc_index=82.5,
        )
    )

    today = date.today()
    for offset in range(6, -1, -1):
        session.add(
            KpiDaily(
                outlet_id=outlet.id,
                day=today - timedelta(days=offset),
                revenue=90000 + offset * 7000,
                plan_percent=92 + offset,
                labor_cost_percent=32.0,
                food_cost_percent=28.5,
                profit_forecast=594000,
                checks=80 + offset * 3,
                lfl_percent=4.2,
            )
        )

    session.add_all(
        [
            AiTicket(
                outlet_id=outlet.id,
                severity=AiTicketSeverity.critical,
                title="ФОТ превышен",
                body=(
                    "ФОТ превышен на 15%. Вчера вышло 5 поваров при выручке 50 000 ₽. "
                    "Перерасход 8 500 ₽."
                ),
                action_label="Исправить график",
                status=AiTicketStatus.open,
            ),
            AiTicket(
                outlet_id=outlet.id,
                severity=AiTicketSeverity.advice,
                title="Продажи сезонного чая",
                body=(
                    "Продажи сезонного чая упали на 20%. Конкуренты включили промо."
                ),
                action_label="Запустить акцию",
                status=AiTicketStatus.open,
            ),
        ]
    )

    session.commit()


def _has_users(session: Session) -> bool:
    """Return True if at least one user exists."""

    return session.execute(select(User.id)).first() is not None


def _ensure_seed_user_email(session: Session, seed_email: str) -> None:
    """Update legacy seed email to a valid address."""

    legacy_email = "demo@portal.local"
    if seed_email == legacy_email:
        return
    user = session.execute(
        select(User).where(User.email == legacy_email)
    ).scalar_one_or_none()
    if user is None:
        return
    user.email = seed_email
    session.commit()
