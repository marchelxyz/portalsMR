"""Auth schemas."""

from __future__ import annotations

from pydantic import BaseModel


class Token(BaseModel):
    """Access token response."""

    access_token: str
    token_type: str = "bearer"
