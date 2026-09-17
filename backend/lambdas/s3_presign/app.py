import json
import os
import uuid
import boto3
from botocore.config import Config

s3_client = boto3.client(
    's3',
    config=Config(signature_version='s3v4')
)

BUCKET_NAME = os.environ.get('INTAKE_BUCKET_NAME', 'hitch-package-vault')
ALLOWED_CONTENT_TYPES = {'image/jpeg', 'image/png', 'image/jpg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit


def lambda_handler(event, context):
    """
    Python 3.12 Lambda behind Amazon API Gateway HTTP API.
    Validates intake photo payload (JPEG/PNG, max 5MB).
    Generates an S3 presigned POST URL with metadata headers (sender_id, request_id).
    """
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    }

    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"status": "ok"})}

    try:
        body = json.loads(event.get("body", "{}"))
    except Exception:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Invalid JSON body format"})
        }

    sender_id = body.get("sender_id")
    request_id = body.get("request_id") or f"req-{uuid.uuid4().hex[:8]}"
    content_type = body.get("content_type", "").lower()
    file_name = body.get("file_name", f"{request_id}.jpg")

    if not sender_id:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Missing required parameter: sender_id"})
        }

    if content_type not in ALLOWED_CONTENT_TYPES:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({
                "error": f"Invalid content type: '{content_type}'. Must be one of {list(ALLOWED_CONTENT_TYPES)}"
            })
        }

    object_key = f"intake/{sender_id}/{request_id}/{file_name}"

    try:
        response = s3_client.generate_presigned_post(
            Bucket=BUCKET_NAME,
            Key=object_key,
            Fields={
                "Content-Type": content_type,
                "x-amz-meta-sender-id": sender_id,
                "x-amz-meta-request-id": request_id
            },
            Conditions=[
                {"Content-Type": content_type},
                {"x-amz-meta-sender-id": sender_id},
                {"x-amz-meta-request-id": request_id},
                ["content-length-range", 100, MAX_FILE_SIZE]
            ],
            ExpiresIn=900  # 15 minutes
        )

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "upload_url": response["url"],
                "fields": response["fields"],
                "object_key": object_key,
                "request_id": request_id,
                "expires_in_seconds": 900
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": f"Failed to generate presigned POST URL: {str(e)}"})
        }
