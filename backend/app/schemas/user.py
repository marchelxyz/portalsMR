"""User schemas."""

from __future__ import annotations

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Payload for creating a user."""

    email: EmailStr
    full_name: str
    password: str


class UserRead(BaseModel):
    """Public user data."""

    id: int
    email: EmailStr
    full_name: str


class PartnerInfo(BaseModel):
    """Partner information."""

    id: int
    name: str


class OutletInfo(BaseModel):
    """Outlet information."""

    id: int
    name: str
    external_id: str | None


class UserProfile(BaseModel):
    """User profile with partner and outlet details."""

    id: int
    email: EmailStr
    full_name: str
    partner: PartnerInfo | None
    outlet: OutletInfo | None
