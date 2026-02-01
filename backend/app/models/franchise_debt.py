"""Franchise debt model."""

from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class FranchiseDebt(Base):
    """Represents financial obligations for an outlet."""

    __tablename__ = "franchise_debts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    outlet_id: Mapped[int] = mapped_column(ForeignKey("outlets.id"), nullable=False)
    royalty_due: Mapped[float] = mapped_column(Float, nullable=False)
    marketing_due: Mapped[float] = mapped_column(Float, nullable=False)
    supplies_due: Mapped[float] = mapped_column(Float, nullable=False)
    qsc_index: Mapped[float] = mapped_column(Float, nullable=False)

    outlet = relationship("Outlet", back_populates="franchise_debts")
