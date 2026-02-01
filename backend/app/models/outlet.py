"""Outlet model."""

from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Outlet(Base):
    """Represents a franchise outlet."""

    __tablename__ = "outlets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    external_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("partners.id"), nullable=False)

    partner = relationship("Partner", back_populates="outlets")
    kpis = relationship("KpiDaily", back_populates="outlet")
    ai_tickets = relationship("AiTicket", back_populates="outlet")
    franchise_debts = relationship("FranchiseDebt", back_populates="outlet")
