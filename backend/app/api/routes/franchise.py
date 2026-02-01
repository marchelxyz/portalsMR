"""Franchise endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.franchise_debt import FranchiseDebt
from app.schemas.franchise import FranchiseSummary

router = APIRouter()


@router.get("/summary", response_model=FranchiseSummary)
def get_franchise_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> FranchiseSummary:
    """Return financial summary for franchise obligations."""

    debt = db.scalar(select(FranchiseDebt))
    if debt is None:
        return FranchiseSummary(
            royalty_due=0,
            marketing_due=0,
            supplies_due=0,
            qsc_index=0,
        )

    return FranchiseSummary(
        royalty_due=debt.royalty_due,
        marketing_due=debt.marketing_due,
        supplies_due=debt.supplies_due,
        qsc_index=debt.qsc_index,
    )
