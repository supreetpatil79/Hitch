import json
import os
import boto3
from datetime import datetime, timezone

bedrock_client = boto3.client(
    'bedrock-runtime',
    region_name=os.environ.get('BEDROCK_REGION', 'us-east-1')
)

MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-5-sonnet-20241022-v2:0')

SYSTEM_PROMPT = """You are the Hitch Packaging Advisor, a concise expert assistant embedded inside the Hitch peer-to-peer intercity logistics platform in India.

Your role:
- Help senders prepare, pack, and tamper-proof their parcels for intercity commuter delivery
- Answer packaging, safety, weight estimation, and handoff questions
- Provide actionable, India-specific advice (available materials: cello tape, newspaper, jute bags, courier bags, duplex boxes — all available at local stationery shops)
- Reference Hitch-specific features when relevant: RBI ₹10 Banknote Tamper Seal, 4-digit OTP handshake, Pickup/Delivery verification

Tone: Direct, friendly, practical. No fluff. Short paragraphs. Use bullet points for steps.

Hitch platform context:
- Carriers are real commuters on trains, buses, cars, and flights traveling between Indian cities
- Packages are physically handed over at transit hubs (railway stations, bus depots, airports)
- Escrow payment is released only after delivery OTP is verified
- Maximum package weight per booking is based on carrier's spare luggage capacity

When the user shares package context (category, weight, transport mode), tailor your advice specifically to that shipment.

Always end your response with 2-3 short follow-up suggestion prompts formatted as a JSON block at the very end of your message like this (and ONLY at the very end, not inline):
SUGGESTIONS_JSON:["suggestion 1","suggestion 2","suggestion 3"]

Keep the main response text clean — do not include any JSON in the visible reply text itself."""


def build_messages(conversation_history, user_message, package_context=None, image_base64=None, image_media_type=None):
    """Build the messages array for Bedrock Claude API call."""
    messages = []

    # Add conversation history (exclude system messages)
    for turn in conversation_history:
        if turn.get("role") in ("user", "assistant"):
            messages.append(turn)

    # Build current user message content
    content = []

    # If image is attached, add it as vision input
    if image_base64 and image_media_type:
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": image_media_type,
                "data": image_base64
            }
        })
        # Enhance the text prompt for image inspection
        inspection_prompt = f"""Please inspect this parcel photo and provide:
1. A Tamper Resistance Score (0-100) with brief justification
2. Packaging quality assessment (seal integrity, wrapping adequacy)
3. Volume tier estimate: backpack / car-boot / oversized
4. Any safety or contraband concerns visible
5. 2-3 specific improvement recommendations

User note: {user_message if user_message else 'Please inspect my package photo.'}"""
        if package_context:
            ctx = f"\nShipment context: {package_context.get('category','unknown')} package, {package_context.get('weight','?')} kg, via {package_context.get('mode','?')} transport."
            inspection_prompt += ctx
        content.append({"type": "text", "text": inspection_prompt})
    else:
        # Text-only message
        text = user_message
        if package_context and any(package_context.values()):
            ctx_parts = []
            if package_context.get('category'):
                ctx_parts.append(f"category: {package_context['category']}")
            if package_context.get('weight'):
                ctx_parts.append(f"weight: {package_context['weight']} kg")
            if package_context.get('mode'):
                ctx_parts.append(f"transport: {package_context['mode']}")
            if ctx_parts:
                text = f"[Shipment: {', '.join(ctx_parts)}]\n\n{user_message}"
        content.append({"type": "text", "text": text})

    messages.append({"role": "user", "content": content})
    return messages


def parse_suggestions(reply_text):
    """Extract SUGGESTIONS_JSON from Claude's response and clean the reply text."""
    suggestions = []
    clean_text = reply_text

    marker = "SUGGESTIONS_JSON:"
    if marker in reply_text:
        idx = reply_text.index(marker)
        suggestions_raw = reply_text[idx + len(marker):].strip()
        clean_text = reply_text[:idx].strip()
        try:
            suggestions = json.loads(suggestions_raw)
        except Exception:
            suggestions = []

    return clean_text, suggestions


def lambda_handler(event, context):
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
            "body": json.dumps({"error": "Invalid JSON body"})
        }

    user_message = body.get("message", "").strip()
    conversation_history = body.get("conversation_history", [])
    package_context = body.get("package_context", {})
    image_base64 = body.get("image_base64")
    image_media_type = body.get("image_media_type", "image/jpeg")

    if not user_message and not image_base64:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Missing message or image"})
        }

    try:
        messages = build_messages(
            conversation_history=conversation_history,
            user_message=user_message,
            package_context=package_context,
            image_base64=image_base64,
            image_media_type=image_media_type
        )

        payload = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 800,
            "system": SYSTEM_PROMPT,
            "messages": messages
        }

        response = bedrock_client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(payload),
            contentType="application/json",
            accept="application/json"
        )

        response_body = json.loads(response['body'].read())
        raw_reply = response_body.get("content", [{}])[0].get("text", "").strip()

        clean_reply, suggestions = parse_suggestions(raw_reply)

        # Default suggestions if Claude didn't provide any
        if not suggestions:
            suggestions = [
                "How do I seal fragile items?",
                "What is the ₹10 Banknote Seal?",
                "How does OTP handover work?"
            ]

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "reply": clean_reply,
                "suggestions": suggestions[:3],
                "model": MODEL_ID,
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        }

    except Exception as e:
        print(f"Bedrock chat error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({
                "error": "Advisor temporarily unavailable. Please try again.",
                "detail": str(e)
            })
        }
