"""S3 client wrapper for Yandex Object Storage."""

from __future__ import annotations

from datetime import timedelta

import boto3

from app.core.config import get_settings


class S3Client:
    """Wrapper for generating S3 presigned URLs."""

    def __init__(self) -> None:
        settings = get_settings()
        self._client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            region_name=settings.s3_region,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
        )
        self._bucket_name = settings.s3_bucket_name

    def create_presigned_upload_url(
        self, object_key: str, expires_in: timedelta | None = None
    ) -> str:
        """Generate a presigned URL for uploads."""

        expiration = int((expires_in or timedelta(minutes=10)).total_seconds())
        return self._client.generate_presigned_url(
            "put_object",
            Params={"Bucket": self._bucket_name, "Key": object_key},
            ExpiresIn=expiration,
        )
