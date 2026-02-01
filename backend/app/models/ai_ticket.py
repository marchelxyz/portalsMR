"""AI ticket model."""

from __future__ import annotations

import enum

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class AiTicketSeverity(str, enum.Enum):
    """Severity levels for AI tickets."""

    critical = "critical"
    warning = "warning"
    advice = "advice"


class AiTicketStatus(str, enum.Enum):
    """Status values for AI tickets."""

    open = "open"
    done = "done"


class AiTicket(Base):
    """Represents an AI-generated recommendation ticket."""

    __tablename__ = "ai_tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    outlet_id: Mapped[int] = mapped_column(ForeignKey("outlets.id"), nullable=False)
    severity: Mapped[AiTicketSeverity] = mapped_column(
        Enum(AiTicketSeverity), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    action_label: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[AiTicketStatus] = mapped_column(Enum(AiTicketStatus), nullable=False)

    outlet = relationship("Outlet", back_populates="ai_tickets")
