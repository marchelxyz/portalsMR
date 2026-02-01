"""Application configuration settings."""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed application settings loaded from environment."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Portal 2.0 Backend"
    environment: str = "local"
    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/portal",
    )
    jwt_secret_key: str = Field(default="change-me")
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=60)
    cors_allow_origins: str = Field(default="*")

    seed_user_email: str = Field(default="demo@portal.local")
    seed_user_password: str = Field(default="demo1234")
    seed_user_full_name: str = Field(default="Demo Partner")
    seed_partner_name: str = Field(default="Portal Franchise")
    seed_outlet_name: str = Field(default="Точка №1")

    s3_endpoint_url: str = Field(default="https://storage.yandexcloud.net")
    s3_access_key: str = Field(default="change-me")
    s3_secret_key: str = Field(default="change-me")
    s3_bucket_name: str = Field(default="portal-uploads")
    s3_region: str = Field(default="ru-central1")

    ai_provider: str = Field(default="stub")


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""

    return Settings()
