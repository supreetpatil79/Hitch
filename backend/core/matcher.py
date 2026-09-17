"""
HITCH / HOPDROP CORE DOMAIN LOGIC & CORRIDOR MATCHER ENGINE
Python 3.12 pure framework-agnostic implementation.

Domain Models:
- TransportMode, PackageCategory, TripStatus, DeliveryRequestStatus, MatchStatus, PaymentStatus, TimelineEventType
- LocationCoordinates, Location, DimensionsCm, AvailableCapacity, CommuterTrip, PackageDetails, RecipientDetails, DeliveryWindow, PackageParcel, OTPVerification, TimelineEvent, MatchHandshake, RatingEntry

Algorithm:
- haversine_km(), normalize_city(), city_similarity(), coordinate_bonus(), calculate_quote(), compute_corridor_match_score()
"""

import math
from datetime import datetime, timezone
from difflib import SequenceMatcher
from enum import Enum
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any, Tuple

PLATFORM_FEE_RATE = 0.12  # 12% Platform Take Rate


# ============================================================================
# 1. ENUMS & DOMAIN CONSTANTS
# ============================================================================

class TransportMode(str, Enum):
    BUS = "bus"
    TRAIN = "train"
    CAR = "car"
    BIKE = "bike"
    FLIGHT = "flight"
    OTHER = "other"


class PackageCategory(str, Enum):
    DOCUMENTS = "documents"
    CLOTHING = "clothing"
    ELECTRONICS = "electronics"
    FOOD = "food"
    FRAGILE = "fragile"
    MEDICINE = "medicine"
    OTHER = "other"


class TripStatus(str, Enum):
    ACTIVE = "active"
    FULL = "full"
    IN_TRANSIT = "in_transit"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class DeliveryRequestStatus(str, Enum):
    PENDING = "pending"
    MATCHED = "matched"
    PICKUP_OTP_SENT = "pickup_otp_sent"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERY_OTP_SENT = "delivery_otp_sent"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class MatchStatus(str, Enum):
    PROPOSED = "proposed"
    CARRIER_ACCEPTED = "carrier_accepted"
    SENDER_CONFIRMED = "sender_confirmed"
    ACTIVE = "active"
    PICKUP_PENDING = "pickup_pending"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERY_PENDING = "delivery_pending"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"


class PaymentStatus(str, Enum):
    UNPAID = "unpaid"
    ESCROW_HELD = "paid"
    RELEASED = "released"
    REFUNDED = "refunded"
    PARTIAL_REFUND = "partial_refund"


class TimelineEventType(str, Enum):
    MATCH_PROPOSED = "match_proposed"
    CARRIER_ACCEPTED = "carrier_accepted"
    SENDER_CONFIRMED = "sender_confirmed"
    PAYMENT_DONE = "payment_done"
    PICKUP_OTP_GENERATED = "pickup_otp_generated"
    PICKUP_VERIFIED = "pickup_verified"
    DELIVERY_OTP_GENERATED = "delivery_otp_generated"
    DELIVERY_VERIFIED = "delivery_verified"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"
    RAPIDO_BOOKED = "rapido_booked"


# ============================================================================
# 2. DOMAIN DATA SCHEMAS
# ============================================================================

@dataclass
class LocationCoordinates:
    latitude: float
    longitude: float


@dataclass
class Location:
    city: str
    state: Optional[str] = None
    coordinates: Optional[LocationCoordinates] = None
    place_id: Optional[str] = None
    full_address: Optional[str] = None


@dataclass
class DimensionsCm:
    length: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None


@dataclass
class AvailableCapacity:
    weight_kg: float
    dimensions_cm: Optional[DimensionsCm] = None
    allowed_categories: List[PackageCategory] = field(default_factory=list)


@dataclass
class CommuterTrip:
    trip_id: str
    carrier_id: str
    origin: Location
    destination: Location
    departure_time: datetime
    mode_of_transport: TransportMode
    available_capacity: AvailableCapacity
    price_per_kg: float
    carrier_rating_average: float = 5.0
    carrier_total_deliveries: int = 0
    estimated_arrival_time: Optional[datetime] = None
    status: TripStatus = TripStatus.ACTIVE
    safety_deposit_paid: bool = False
    safety_deposit_amount: Optional[float] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class PackageDetails:
    description: str
    category: PackageCategory
    weight_kg: float
    dimensions_cm: Optional[DimensionsCm] = None
    is_fragile: bool = False
    declared_value: Optional[float] = None
    photo_url: Optional[str] = None


@dataclass
class RecipientDetails:
    name: str
    phone: str
    address: str


@dataclass
class DeliveryWindow:
    earliest: datetime
    latest: datetime


@dataclass
class PackageParcel:
    request_id: str
    sender_id: str
    origin: Location
    destination: Location
    package: PackageDetails
    recipient: RecipientDetails
    preferred_delivery_window: DeliveryWindow
    status: DeliveryRequestStatus = DeliveryRequestStatus.PENDING
    payment_status: PaymentStatus = PaymentStatus.UNPAID
    quoted_price: Optional[float] = None
    platform_fee: Optional[float] = None
    total_charge: Optional[float] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class OTPVerification:
    code: Optional[str] = None
    generated_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None


@dataclass
class TimelineEvent:
    event: TimelineEventType
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    actor_id: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class RatingEntry:
    score: Optional[float] = None
    comment: Optional[str] = None
    at: Optional[datetime] = None


@dataclass
class MatchHandshake:
    match_id: str
    trip_id: str
    delivery_request_id: str
    carrier_id: str
    sender_id: str
    agreed_price: float
    payout_to_carrier: float
    platform_fee: float
    status: MatchStatus = MatchStatus.PROPOSED
    pickup_otp: OTPVerification = field(default_factory=OTPVerification)
    delivery_otp: OTPVerification = field(default_factory=OTPVerification)
    timeline: List[TimelineEvent] = field(default_factory=list)
    escrow_transaction_id: Optional[str] = None
    sender_rating: Optional[RatingEntry] = None
    carrier_rating: Optional[RatingEntry] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================================================
# 3. CARRIER MATCHING & CORRIDOR ALGORITHM
# ============================================================================

def haversine_km(origin: Tuple[float, float], destination: Tuple[float, float]) -> float:
    """Calculates great-circle distance between two (longitude, latitude) points in kilometers."""
    lng1, lat1 = origin
    lng2, lat2 = destination
    earth_radius_km = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return earth_radius_km * c


def normalize_city(city: Optional[str]) -> str:
    """Normalizes city name strings for fuzzy comparison."""
    if not city:
        return ""
    return " ".join(city.strip().lower().split())


def city_similarity(left: Optional[str], right: Optional[str]) -> float:
    """Computes textual similarity score between origin/destination city names [0.0 - 1.0]."""
    left_norm = normalize_city(left)
    right_norm = normalize_city(right)
    if not left_norm or not right_norm:
        return 0.0
    if left_norm == right_norm:
        return 1.0
    if left_norm in right_norm or right_norm in left_norm:
        return 0.92
    return SequenceMatcher(None, left_norm, right_norm).ratio()


def coordinate_bonus(
    left_coords: Optional[LocationCoordinates],
    right_coords: Optional[LocationCoordinates],
) -> float:
    """Computes spatial proximity bonus based on GPS coordinates distance."""
    if not left_coords or not right_coords:
        return 0.0
    dist_km = haversine_km(
        (left_coords.longitude, left_coords.latitude),
        (right_coords.longitude, right_coords.latitude),
    )
    if dist_km <= 15.0:
        return 0.15
    if dist_km <= 50.0:
        return 0.08
    if dist_km <= 120.0:
        return 0.03
    return 0.0


def calculate_quote(trip: CommuterTrip, parcel: PackageParcel) -> Dict[str, float]:
    """Calculates carrier payout, platform fee, and total sender charge in INR (paise precision)."""
    base_price = trip.price_per_kg * parcel.package.weight_kg * 100
    fragile_extra = base_price * 0.2 if parcel.package.is_fragile else 0.0
    carrier_payout_paise = round(base_price + fragile_extra)
    platform_fee_paise = round(carrier_payout_paise * PLATFORM_FEE_RATE)
    total_charge_paise = carrier_payout_paise + platform_fee_paise
    return {
        "carrier_payout_inr": carrier_payout_paise / 100.0,
        "platform_fee_inr": platform_fee_paise / 100.0,
        "total_charge_inr": total_charge_paise / 100.0,
    }


def compute_corridor_match_score(
    trip: CommuterTrip,
    parcel: PackageParcel
) -> Dict[str, Any]:
    """
    Pure standalone scoring function.
    Takes a commuter route (trip) and parcel request, returning multi-signal match score and quote.
    Scoring Signals Breakdown (Total Max Raw Score ~ 100):
    - Route Similarity (Origin + Destination alignment): max 56 pts
    - Schedule Alignment (Pickup window vs Departure time): max 16 pts
    - Capacity Fit (Available capacity vs Package weight): max 10 pts
    - Category Support (Allowed vs Package category): max 10 pts
    - Carrier Trust (Rating multiplier): max 10 pts
    - Price Efficiency: max 8 pts
    Returns normalized score between 0.0000 and 0.9999 along with an itemized financial quote.
    """
    reasons: List[str] = []
    
    # 1. Route Signal (City string fuzzy match + GPS proximity bonus)
    origin_sim = city_similarity(parcel.origin.city, trip.origin.city) + coordinate_bonus(
        parcel.origin.coordinates, trip.origin.coordinates
    )
    dest_sim = city_similarity(parcel.destination.city, trip.destination.city) + coordinate_bonus(
        parcel.destination.coordinates, trip.destination.coordinates
    )
    route_score = min(origin_sim, 1.15) * 28.0 + min(dest_sim, 1.15) * 28.0
    if origin_sim >= 0.95 and dest_sim >= 0.95:
        reasons.append("exact_city_pair_match")
    elif origin_sim >= 0.75 and dest_sim >= 0.75:
        reasons.append("close_route_corridor_match")

    # 2. Timing/Schedule Alignment Signal
    departure = trip.departure_time
    window = parcel.preferred_delivery_window
    if window.earliest <= departure <= window.latest:
        schedule_score = 16.0
        reasons.append("pickup_window_aligned")
    else:
        hours_delta = min(abs((departure - window.latest).total_seconds()) / 3600.0, 24.0)
        schedule_score = max(0.0, 16.0 - hours_delta)

    # 3. Capacity Signal
    if trip.available_capacity.weight_kg >= parcel.package.weight_kg:
        capacity_gap = trip.available_capacity.weight_kg - parcel.package.weight_kg
        capacity_score = min(10.0, 6.0 + capacity_gap)
        reasons.append("capacity_sufficient")
    else:
        capacity_score = 0.0

    # 4. Category Support Signal
    if not trip.available_capacity.allowed_categories or parcel.package.category in trip.available_capacity.allowed_categories:
        category_score = 10.0
        reasons.append("category_supported")
    else:
        category_score = 0.0

    # 5. Carrier Trust & Rating Signal
    rating_score = min(trip.carrier_rating_average, 5.0) * 2.2
    if trip.carrier_rating_average >= 4.7:
        reasons.append("high_carrier_rating")

    # 6. Price Efficiency Signal
    estimated_price = trip.price_per_kg * parcel.package.weight_kg
    price_score = max(0.0, 8.0 - min(estimated_price / 120.0, 8.0))
    if estimated_price <= 250.0:
        reasons.append("price_efficient")

    # Final Total Computation & Normalization
    total_raw_score = (
        route_score
        + schedule_score
        + capacity_score
        + category_score
        + rating_score
        + price_score
    )
    normalized_score = round(max(0.0, min(total_raw_score / 100.0, 0.9999)), 4)
    financial_quote = calculate_quote(trip, parcel)

    return {
        "trip_id": trip.trip_id,
        "request_id": parcel.request_id,
        "carrier_id": trip.carrier_id,
        "sender_id": parcel.sender_id,
        "match_score": normalized_score,
        "reasons": reasons,
        "financial_quote": financial_quote,
    }
