"""Franchise schemas."""

from __future__ import annotations

from pydantic import BaseModel


class FranchiseSummary(BaseModel):
    """Franchise financial summary."""

    royalty_due: float
    marketing_due: float
    supplies_due: float
    qsc_index: float
