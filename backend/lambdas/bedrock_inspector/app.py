import base64
import json
import os
import urllib.parse
import boto3
from datetime import datetime, timezone

s3_client = boto3.client('s3')
bedrock_client = boto3.client('bedrock-runtime', region_name=os.environ.get('BEDROCK_REGION', 'us-east-1'))
dynamodb = boto3.resource('dynamodb')

TABLE_NAME = os.environ.get('TABLE_NAME', 'HitchTable')
MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-5-sonnet-20241022-v2:0')
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    """
    S3 ObjectCreated Event Trigger Lambda.
    Reads uploaded package photo, invokes Bedrock Claude 3.5 Sonnet for safety inspection,
    and updates DynamoDB item with AI verification audit record.
    """
    for record in event.get('Records', []):
        bucket = record['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(record['s3']['object']['key'])

        print(f"Processing image object from bucket '{bucket}', key: '{key}'")

        try:
            # Extract request_id from key pattern: intake/{sender_id}/{request_id}/{file_name}
            key_parts = key.split('/')
            request_id = key_parts[2] if len(key_parts) >= 3 else f"req-{key.replace('/', '-')}"
            sender_id = key_parts[1] if len(key_parts) >= 2 else "unknown_sender"

            # 1. Fetch object content from S3
            response = s3_client.get_object(Bucket=bucket, Key=key)
            image_bytes = response['Body'].read()
            base64_image = base64.b64encode(image_bytes).decode('utf-8')

            # Determine image mime type
            content_type = response.get('ContentType', 'image/jpeg')
            media_type = "image/png" if "png" in content_type.lower() else "image/jpeg"

            # 2. Construct Bedrock Claude 3.5 Sonnet payload
            prompt = """
Act as a strict Multimodal Security & Safety Inspector for 'Hitch', a peer-to-peer commuter crowd-shipping platform.
Analyze the provided package intake image and return ONLY a valid raw JSON object (no markdown, no backticks, no explanatory prose) with this exact schema:

{
  "prohibited_items_detected": boolean,
  "risk_summary": string,
  "detected_category": "documents" | "clothing" | "electronics" | "food" | "fragile" | "medicine" | "other",
  "estimated_volume_tier": "backpack" | "car_boot" | "oversized",
  "packaging_integrity_score": integer (0 to 100),
  "handling_tags": list of strings
}

Inspection Rules:
1. Prohibited items include weapons, explosives, illegal drugs, hazardous chemicals, unmarked liquids, or counterfeit currency.
2. If any prohibited item is suspected, set prohibited_items_detected to true and describe in risk_summary.
3. Keep risk_summary concise and actionable.
"""

            payload = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": media_type,
                                    "data": base64_image
                                }
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ]
                    }
                ]
            }

            # 3. Invoke Amazon Bedrock
            print(f"Invoking Bedrock model: {MODEL_ID}")
            bedrock_response = bedrock_client.invoke_model(
                modelId=MODEL_ID,
                body=json.dumps(payload),
                contentType="application/json",
                accept="application/json"
            )

            response_body = json.loads(bedrock_response['body'].read())
            raw_text = response_body.get("content", [{}])[0].get("text", "")

            # Clean JSON if formatted in backticks
            cleaned_json = raw_text.strip()
            if cleaned_json.startswith("```json"):
                cleaned_json = cleaned_json[7:]
            if cleaned_json.startswith("```"):
                cleaned_json = cleaned_json[3:]
            if cleaned_json.endswith("```"):
                cleaned_json = cleaned_json[:-3]

            inspection_result = json.loads(cleaned_json.strip())

            prohibited = inspection_result.get("prohibited_items_detected", False)
            package_status = "FLAGGED" if prohibited else "VERIFIED"

            # 4. Write inspection record to DynamoDB
            table.update_item(
                Key={
                    "PK": f"PACKAGE#{request_id}",
                    "SK": "METADATA"
                },
                UpdateExpression="""
                    SET package_status = :status,
                        sender_id = :sender,
                        ai_inspection = :ai,
                        photo_s3_key = :s3key,
                        updated_at = :now
                """,
                ExpressionAttributeValues={
                    ":status": package_status,
                    ":sender": sender_id,
                    ":ai": inspection_result,
                    ":s3key": key,
                    ":now": datetime.now(timezone.utc).isoformat()
                }
            )

            print(f"Package '{request_id}' successfully inspected by Bedrock. Status: {package_status}")

        except Exception as e:
            print(f"Error processing S3 image '{key}': {str(e)}")
            # Fallback record on inspection error
            try:
                table.update_item(
                    Key={
                        "PK": f"PACKAGE#{request_id}",
                        "SK": "METADATA"
                    },
                    UpdateExpression="SET package_status = :status, inspection_error = :err, updated_at = :now",
                    ExpressionAttributeValues={
                        ":status": "FLAGGED",
                        ":err": str(e),
                        ":now": datetime.now(timezone.utc).isoformat()
                    }
                )
            except Exception as ddb_err:
                print(f"DynamoDB write error: {str(ddb_err)}")

    return {"statusCode": 200, "body": json.dumps("Inspection complete")}
