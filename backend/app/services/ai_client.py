"""AI client placeholder."""

from __future__ import annotations

from pydantic import BaseModel


class AiRecommendation(BaseModel):
    """AI recommendation payload."""

    title: str
    body: str
    action_label: str
    severity: str


class AiClient:
    """Stub AI client to be replaced with real provider."""

    def generate_recommendations(self, context: str) -> list[AiRecommendation]:
        """Return mocked recommendations until AI is connected."""

        return [
            AiRecommendation(
                title="ФОТ превышен",
                body=(
                    "ФОТ превышен на 15%. Вчера вышло 5 поваров при выручке 50 000 ₽."
                ),
                action_label="Исправить график",
                severity="critical",
            )
        ]
