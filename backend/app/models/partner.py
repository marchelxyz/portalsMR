"""Partner model."""

from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Partner(Base):
    """Represents a franchise partner."""

    __tablename__ = "partners"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    outlets = relationship("Outlet", back_populates="partner")
    users = relationship("User", back_populates="partner")
