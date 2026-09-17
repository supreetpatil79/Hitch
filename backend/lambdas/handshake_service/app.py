import json
import os
import boto3
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')
sfn_client = boto3.client('stepfunctions')

TABLE_NAME = os.environ.get('TABLE_NAME', 'HitchTable')
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    """
    Python 3.12 Lambda handling OTP verification & carrier handshake endpoints.
    Verifies submitted OTPs against stored OTP verification codes in DynamoDB.
    Resumes Step Functions workflow via send_task_success or send_task_failure.
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

    match_id = body.get("match_id")
    handshake_type = body.get("handshake_type")  # 'CARRIER_ACCEPT', 'PICKUP_OTP', 'DELIVERY_OTP'
    otp_code = body.get("otp_code")
    task_token = body.get("task_token")

    if not match_id or not handshake_type:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Missing required parameters: match_id, handshake_type"})
        }

    # Fetch Match Record from DynamoDB
    try:
        response = table.get_item(
            Key={
                "PK": f"MATCH#{match_id}",
                "SK": "HANDSHAKE"
            }
        )
        match_item = response.get("Item")
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": f"DynamoDB query failed: {str(e)}"})
        }

    if not match_item:
        return {
            "statusCode": 444,
            "headers": headers,
            "body": json.dumps({"error": f"Match record '{match_id}' not found"})
        }

    task_token = task_token or match_item.get("active_task_token")

    # Handle Carrier Acceptance
    if handshake_type == "CARRIER_ACCEPT":
        table.update_item(
            Key={"PK": f"MATCH#{match_id}", "SK": "HANDSHAKE"},
            UpdateExpression="SET match_status = :m_status, carrier_accepted_at = :now",
            ExpressionAttributeValues={
                ":m_status": "CARRIER_ACCEPTED",
                ":now": datetime.now(timezone.utc).isoformat()
            }
        )
        if task_token:
            try:
                sfn_client.send_task_success(
                    taskToken=task_token,
                    output=json.dumps({"status": "CARRIER_ACCEPTED", "match_id": match_id})
                )
            except Exception as sfn_err:
                print(f"StepFunctions send_task_success warning: {str(sfn_err)}")

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "status": "success",
                "message": "Carrier acceptance registered",
                "match_id": match_id
            })
        }

    # Handle Pickup / Delivery OTP Handshake
    expected_otp = None
    if handshake_type == "PICKUP_OTP":
        expected_otp = match_item.get("pickup_otp", {}).get("code") or match_item.get("pickup_otp_code", "123456")
    elif handshake_type == "DELIVERY_OTP":
        expected_otp = match_item.get("delivery_otp", {}).get("code") or match_item.get("delivery_otp_code", "654321")

    if not otp_code or str(otp_code).strip() != str(expected_otp).strip():
        if task_token:
            try:
                sfn_client.send_task_failure(
                    taskToken=task_token,
                    error="INVALID_OTP",
                    cause=f"Submitted OTP '{otp_code}' did not match expected verification code."
                )
            except Exception as sfn_err:
                print(f"StepFunctions send_task_failure error: {str(sfn_err)}")

        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({
                "status": "failed",
                "error": "OTP verification code mismatch",
                "match_id": match_id
            })
        }

    # OTP Verified Successfully
    new_status = "PICKED_UP" if handshake_type == "PICKUP_OTP" else "DELIVERED"
    new_payment_status = "ESCROW_HELD" if handshake_type == "PICKUP_OTP" else "RELEASED"

    table.update_item(
        Key={"PK": f"MATCH#{match_id}", "SK": "HANDSHAKE"},
        UpdateExpression="SET match_status = :m_status, payment_status = :p_status, verified_at = :now",
        ExpressionAttributeValues={
            ":m_status": new_status,
            ":p_status": new_payment_status,
            ":now": datetime.now(timezone.utc).isoformat()
        }
    )

    if task_token:
        try:
            sfn_client.send_task_success(
                taskToken=task_token,
                output=json.dumps({
                    "status": "VERIFIED",
                    "handshake_type": handshake_type,
                    "match_id": match_id,
                    "verified_at": datetime.now(timezone.utc).isoformat()
                })
            )
        except Exception as sfn_err:
            print(f"StepFunctions send_task_success error: {str(sfn_err)}")

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({
            "status": "success",
            "message": f"{handshake_type} verified successfully",
            "match_id": match_id,
            "new_status": new_status
        })
    }
