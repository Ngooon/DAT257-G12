import django_filters
from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg
from datetime import datetime, timedelta
from django.db.models.functions import TruncMonth
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from framework.quickstart.models import (
    Garment,
    Usage,
    Category,
    PaymentMethod,
    Listing,
)
from framework.quickstart.serializers import (
    GarmentSerializer,
    CategorySerializer,
    UsageSerializer,
    PaymentMethodSerializer,
    ListingSerializer,
)

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import F

import requests
from django.http import HttpResponseRedirect, JsonResponse
from django.conf import settings
from urllib.parse import urlencode
from django.contrib.auth.models import User

import jwt
from datetime import datetime, timedelta

# Put your Facebook App details in Django settings.py
FACEBOOK_APP_ID = settings.SOCIAL_AUTH_FACEBOOK_KEY
FACEBOOK_APP_SECRET = settings.SOCIAL_AUTH_FACEBOOK_SECRET
REDIRECT_URI = "http://localhost:8000/auth/facebook/callback"
FRONTEND_REDIRECT = (
    "http://localhost:4200/wardrobe"  # Where Angular should land after login
)


# Step 1: Redirect to Facebook
def facebook_login(request):
    fb_auth_url = "https://www.facebook.com/v22.0/dialog/oauth"
    params = {
        "client_id": FACEBOOK_APP_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": "email,public_profile",
    }
    return HttpResponseRedirect(f"{fb_auth_url}?{urlencode(params)}")


# Step 2: Handle Facebook's callback
def facebook_callback(request):
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "Missing code"}, status=400)

    # Exchange code for access token
    token_url = "https://graph.facebook.com/v22.0/oauth/access_token"
    token_params = {
        "client_id": FACEBOOK_APP_ID,
        "client_secret": FACEBOOK_APP_SECRET,
        "redirect_uri": REDIRECT_URI,
        "code": code,
    }

    token_res = requests.get(token_url, params=token_params)
    access_token = token_res.json().get("access_token")

    if not access_token:
        return JsonResponse({"error": "Failed to get access token"}, status=400)

    # Fetch user info
    user_info_res = requests.get(
        "https://graph.facebook.com/me",
        params={"fields": "id,name,email", "access_token": access_token},
    )

    user_data = user_info_res.json()
    print("Facebook user:", user_data)

    # Optional: Save user to DB, create session, issue JWT, etc.
    # For now, redirect with their name to the frontend

    token_data = generate_token(user_data)
    access_token = token_data["access"]  # or pass both if needed

    # Redirect to Angular with token
    return redirect(f"http://localhost:4200/?token={access_token}")


def generate_token(user_data):
    payload = {
        "id": user_data["id"],
        "name": user_data["name"],
        "email": user_data.get("email", ""),
        "exp": datetime.utcnow() + timedelta(hours=24),
    }
    user, _ = User.objects.get_or_create(
        first_name=payload["name"], username=payload["id"], email=payload["email"]
    )
    refresh = RefreshToken.for_user(user)

    print(refresh.access_token)

    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


class GarmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for garments.
    """

    serializer_class = GarmentSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]  # Lägg till OrderingFilter
    ordering_fields = ["size", "color", "category", "usage_count"]
    filterset_fields = ["size", "color", "category"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Garment.objects.filter(owner=self.request.user).annotate(
            usage_count=Count("usages")
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="size",
                description="Filter garments by size.",
                required=False,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name="color",
                description="Filter garments by color.",
                required=False,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name="category",
                description="Filter garments by category.",
                required=False,
                type=OpenApiTypes.INT,
            ),
            OpenApiParameter(
                name="ordering",
                description="Order results by a specific field. Use `-` for descending order. Available fields: `size`, `color`, `category`, `usage_count`.",
                required=False,
                type=OpenApiTypes.STR,
            ),
        ],
        responses={
            200: GarmentSerializer(many=True),
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                "Example Response for Filtered Garments",
                value=[
                    {
                        "id": 1,
                        "size": "M",
                        "color": "Red",
                        "category": 3,
                        "usage_count": 5,
                    },
                    {
                        "id": 2,
                        "size": "L",
                        "color": "Blue",
                        "category": 2,
                        "usage_count": 3,
                    },
                ],
            ),
        ],
    )
    def list(self, request, *args, **kwargs):
        """
        List all garments for the authenticated user, optionally filtered and ordered.
        """
        return super().list(request, *args, **kwargs)


class GarmentUsageViewSet(viewsets.ViewSet):
    """
    API endpoint for usages related to a specific garment.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="from_time",
                description="Filter usages from this time (ISO 8601 format, e.g., 2025-04-01T00:00:00Z)",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                name="to_time",
                description="Filter usages to this time (ISO 8601 format, e.g., 2025-04-15T23:59:59Z)",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
        ]
    )
    def list(self, request, garment_pk=None):
        """
        List all usages for a specific garment.
        """

        try:
            garment = Garment.objects.get(pk=garment_pk, owner=request.user)
        except Garment.DoesNotExist:
            return Response(
                {"detail": "Not found or not your garment."},
                status=status.HTTP_404_NOT_FOUND,
            )  # tillagd för ägarskap

        usages = Usage.objects.filter(garment=garment)

        from_time = request.query_params.get("from_time")
        to_time = request.query_params.get("to_time")

        if from_time:
            usages = usages.filter(time__gte=from_time)
        if to_time:
            usages = usages.filter(time__lte=to_time)

        serializer = UsageSerializer(
            usages, many=True, context={"request": request}
        )  # Lägg till context
        return Response(serializer.data)


class WardrobeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for wardrobes.
    """

    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Return a list of unique wardrobes based on the user's garments.
        """
        # Hämta alla plagg som tillhör användaren
        garments = Garment.objects.filter(owner=request.user)

        # Extrahera unika garderobsnamn från plaggens data
        unique_wardrobes = garments.values_list("wardrobe", flat=True).distinct()

        # Skapa en lista med unika garderober
        wardrobes = [{"name": wardrobe} for wardrobe in unique_wardrobes if wardrobe]

        return Response(wardrobes)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for usages.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class UsageFilter(django_filters.FilterSet):
    garment_id = django_filters.NumberFilter(field_name="garment__id")
    from_time = django_filters.DateTimeFilter(field_name="time", lookup_expr="gte")
    to_time = django_filters.DateTimeFilter(field_name="time", lookup_expr="lte")
    category = django_filters.NumberFilter(field_name="garment__category__id")
    wardrobe = django_filters.CharFilter(
        field_name="garment__wardrobe", lookup_expr="icontains"
    )

    class Meta:
        model = Usage
        fields = ["garment_id", "from_time", "to_time", "category", "wardrobe"]


class UsageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for usages.
    """

    permission_classes = [IsAuthenticated]

    # queryset = Usage.objects.all().order_by("-time")
    serializer_class = UsageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UsageFilter

    def get_queryset(self):
        return Usage.objects.filter(owner=self.request.user).order_by("-time")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="garment_id",
                description="Filter usages by garment ID.",
                required=False,
                type=OpenApiTypes.INT,
            ),
            OpenApiParameter(
                name="from_time",
                description="Filter usages from this time (ISO 8601 format, e.g., 2025-01-01T00:00:00Z).",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                name="to_time",
                description="Filter usages up to this time (ISO 8601 format, e.g., 2025-04-01T23:59:59Z).",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                name="category",
                description="Filter usages by category ID.",
                required=False,
                type=OpenApiTypes.INT,
            ),
            OpenApiParameter(
                name="wardrobe",
                description="Filter usages by wardrobe.",
                required=False,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name="ordering",
                description="Order results by a specific field. Use `-` for descending order. Available fields: `time`, `garment__id`.",
                required=False,
                type=OpenApiTypes.STR,
            ),
        ],
        responses={
            200: UsageSerializer(many=True),
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                "Example Response for Filtered Usages",
                value=[
                    {
                        "id": 1,
                        "garment": 16,
                        "time": "2025-04-28T08:02:03.139734Z",
                        "description": "Worn at a party.",
                    },
                    {
                        "id": 2,
                        "garment": 16,
                        "time": "2025-04-25T10:15:45.123456Z",
                        "description": "Used for a meeting.",
                    },
                ],
            ),
        ],
    )
    def list(self, request, *args, **kwargs):
        """
        List all usages for the authenticated user, optionally filtered and ordered.
        """
        return super().list(request, *args, **kwargs)


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """
    API endpoint for usages.
    """

    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer


class ListingFilter(filters.FilterSet):
    garment_size = filters.CharFilter(
        field_name="garment__size", lookup_expr="icontains"
    )
    garment_color = filters.CharFilter(
        field_name="garment__color", lookup_expr="icontains"
    )
    garment_category = filters.CharFilter(
        field_name="garment__category__name", lookup_expr="icontains"
    )
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Listing
        fields = [
            "garment_size",
            "garment_color",
            "garment_category",
            "price",
            "place",
            "payment_method",
            "min_price",
            "max_price",
        ]


class ListingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for usages.
    """

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(owner=self.request.user).annotate(
            garment_size=F("garment__size"),
            garment_color=F("garment__color"),
            garment_category=F("garment__category"),
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    serializer_class = ListingSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    ordering_fields = [
        "garment_size",
        "garment_color",
        "garment_category",
        "price",
        "place",
        "payment_method",
    ]
    filterset_class = ListingFilter


class StatisticsViewSet(viewsets.ViewSet):
    """
    API endpoint for statistics.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="from_time",
                description="Filter usages from this time (ISO 8601 format, e.g., 2025-01-01T00:00:00Z). Default is one year ago.",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                name="to_time",
                description="Filter usages up to this time (ISO 8601 format, e.g., 2025-04-01T23:59:59Z). Default is today's date.",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                name="id",
                description="Filter statistics for a specific category by its ID. If not provided, statistics for all categories will be returned.",
                required=False,
                type=OpenApiTypes.INT,
            ),
        ],
        responses={
            200: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                "Example Response for All Categories",
                value=[
                    {
                        "id": 1,
                        "statistics": {
                            "mean_usage": 2.5,
                            "total_usage": 30,
                            "last_usage": "2025-04-28T08:02:03.139734Z",
                            "usage_history": {
                                "2025-04-01T00:00:00.000Z": 2,
                                "2025-03-01T00:00:00.000Z": 3,
                                "2025-02-01T00:00:00.000Z": 1,
                            },
                        },
                    },
                    {
                        "id": 2,
                        "statistics": {
                            "mean_usage": 1.8,
                            "total_usage": 22,
                            "last_usage": "2025-04-25T10:15:45.123456Z",
                            "usage_history": {
                                "2025-04-01T00:00:00.000Z": 1,
                                "2025-03-01T00:00:00.000Z": 2,
                                "2025-02-01T00:00:00.000Z": 2,
                            },
                        },
                    },
                ],
            ),
            OpenApiExample(
                "Example Response for a Specific Category",
                value={
                    "id": 1,
                    "statistics": {
                        "mean_usage": 2.5,
                        "total_usage": 30,
                        "last_usage": "2025-04-28T08:02:03.139734Z",
                        "usage_history": {
                            "2025-04-01T00:00:00.000Z": 2,
                            "2025-03-01T00:00:00.000Z": 3,
                            "2025-02-01T00:00:00.000Z": 1,
                        },
                    },
                },
            ),
        ],
    )
    @action(detail=False, methods=["get"], url_path="category")
    def category(self, request):
        """
        Return statistics for categories, including usage history per month.
        """
        from datetime import datetime, timedelta

        # from django.db.models.functions import TruncMonth
        from django.db.models.functions import TruncWeek

        # Hämta query-parametrar för tidsintervall
        from_time = request.query_params.get("from_time")
        to_time = request.query_params.get("to_time")
        category_id = request.query_params.get(
            "id"
        )  # Hämta kategori-ID som query-param

        # Standardvärden för tidsintervall (senaste året)
        if not from_time:
            from_time = datetime.now() - timedelta(days=365)
        else:
            from_time = datetime.fromisoformat(from_time)

        if not to_time:
            to_time = datetime.now()
        else:
            to_time = datetime.fromisoformat(to_time)

        # Om ett kategori-ID skickas, filtrera på det
        if category_id:
            try:
                categories = Category.objects.filter(pk=category_id)
            except Category.DoesNotExist:
                return Response({"detail": "Category not found."}, status=404)
        else:
            # Annars hämta alla kategorier
            categories = Category.objects.all()

        # Förbered statistik för varje kategori
        data = []
        for category in categories:
            # Filtrera usages för den aktuella kategorin och användaren
            usages = Usage.objects.filter(
                garment__category=category,
                owner=request.user,
                time__gte=from_time,
                time__lte=to_time,
            )

            # Grupp och räkna usages per månad
            usages_per_week = (
                usages.annotate(week=TruncWeek("time"))
                .values("week")
                .annotate(count=Count("id"))
                .order_by("week")
            )

            # Calculate mean usages per garment and per week
            total_garments = Garment.objects.filter(
                owner=request.user, category=category
            ).count()
            usages_per_week_per_garment = []

            for garment in Garment.objects.filter(
                owner=request.user, category=category
            ):
                garment_usages_per_week = (
                    Usage.objects.filter(
                        garment=garment, time__gte=from_time, time__lte=to_time
                    )
                    .annotate(week=TruncWeek("time"))
                    .values("week")
                    .annotate(count=Count("id"))
                    .order_by("week")
                )
                usages_per_week_per_garment.append(garment_usages_per_week)

            mean_usages_per_week = {}
            for week_data in usages_per_week_per_garment:
                for entry in week_data:
                    week = entry["week"]
                    count = entry["count"]
                    if week not in mean_usages_per_week:
                        mean_usages_per_week[week] = []
                    mean_usages_per_week[week].append(count)

            mean_usages_per_week = {
                week.strftime("%Y-%m-%dT%H:%M:%S.%fZ"): sum(counts) / len(counts)
                for week, counts in mean_usages_per_week.items()
            }

            # Beräkna total användning och mean usage
            total_usage = sum(item["count"] for item in usages_per_week)
            mean_usage = total_usage / 12  # Genomsnitt per månad över hela året

            # Hämta senaste användningen
            last_usage = usages.order_by("-time").first()

            # Skapa usage history per månad
            usage_history = {
                item["week"].strftime("%Y-%m-%dT%H:%M:%S.%fZ"): item["count"]
                for item in usages_per_week
            }

            # Lägg till statistik i resultatet
            data.append(
                {
                    "id": category.id,
                    "statistics": {
                        "mean_usage": mean_usage,
                        "total_usage": total_usage,
                        "last_usage": last_usage.time if last_usage else None,
                        "usage_history": usage_history,
                        "mean_usages_per_week": mean_usages_per_week,  # Add mean_usages_per_week to the response
                    },
                }
            )

        return Response(data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="from_time",
                description="Filter usages from this time (ISO 8601 format, e.g., 2025-01-01T00:00:00Z). Default is one year ago.",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                name="to_time",
                description="Filter usages up to this time (ISO 8601 format, e.g., 2025-04-01T23:59:59Z). Default is today's date.",
                required=False,
                type=OpenApiTypes.DATETIME,
            ),
            OpenApiParameter(
                name="id",
                description="Filter statistics for a specific garment by its ID. If not provided, statistics for all garments will be returned.",
                required=False,
                type=OpenApiTypes.INT,
            ),
        ],
        responses={
            200: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                "Example Response for All Garments",
                value=[
                    {
                        "id": 1,
                        "statistics": {
                            "mean_usage": 2.5,
                            "total_usage": 30,
                            "last_usage": "2025-04-28T08:02:03.139734Z",
                            "usage_history": {
                                "2025-04-01T00:00:00.000Z": 2,
                                "2025-03-01T00:00:00.000Z": 3,
                                "2025-02-01T00:00:00.000Z": 1,
                            },
                        },
                    },
                    {
                        "id": 2,
                        "statistics": {
                            "mean_usage": 1.8,
                            "total_usage": 22,
                            "last_usage": "2025-04-25T10:15:45.123456Z",
                            "usage_history": {
                                "2025-04-01T00:00:00.000Z": 1,
                                "2025-03-01T00:00:00.000Z": 2,
                                "2025-02-01T00:00:00.000Z": 2,
                            },
                        },
                    },
                ],
            ),
            OpenApiExample(
                "Example Response for a Specific Garment",
                value={
                    "id": 1,
                    "statistics": {
                        "mean_usage": 2.5,
                        "total_usage": 30,
                        "last_usage": "2025-04-28T08:02:03.139734Z",
                        "usage_history": {
                            "2025-04-01T00:00:00.000Z": 2,
                            "2025-03-01T00:00:00.000Z": 3,
                            "2025-02-01T00:00:00.000Z": 1,
                        },
                    },
                },
            ),
        ],
    )
    @action(detail=False, methods=["get"], url_path="garment")
    def garment(self, request):
        """
        Return statistics for garments, including usage history per month.
        """
        from datetime import datetime, timedelta

        # from django.db.models.functions import TruncMonth
        from django.db.models.functions import TruncWeek

        # Hämta query-parametrar för tidsintervall
        from_time = request.query_params.get("from_time")
        to_time = request.query_params.get("to_time")
        garment_id = request.query_params.get("id")  # Hämta garment-ID som query-param

        # Standardvärden för tidsintervall (senaste året)
        if not from_time:
            from_time = datetime.now() - timedelta(days=365)
        else:
            from_time = datetime.fromisoformat(from_time)

        if not to_time:
            to_time = datetime.now()
        else:
            to_time = datetime.fromisoformat(to_time)

        # Om ett garment-ID skickas, filtrera på det
        if garment_id:
            try:
                garments = Garment.objects.filter(pk=garment_id, owner=request.user)
            except Garment.DoesNotExist:
                return Response({"detail": "Garment not found."}, status=404)
        else:
            # Annars hämta alla garments för användaren
            garments = Garment.objects.filter(owner=request.user)

        # Förbered statistik för varje garment
        data = []
        for garment in garments:
            # Filtrera usages för det aktuella garment och användaren
            usages = Usage.objects.filter(
                garment=garment,
                owner=request.user,
                time__gte=from_time,
                time__lte=to_time,
            )

            # Grupp och räkna usages per vecka
            usages_per_week = (
                usages.annotate(week=TruncWeek("time"))
                .values("week")
                .annotate(count=Count("id"))
                .order_by("week")
            )

            # Beräkna total användning och mean usage
            total_usage = sum(item["count"] for item in usages_per_week)
            mean_usage = total_usage / 12  # Genomsnitt per månad över hela året

            # Hämta senaste användningen
            last_usage = usages.order_by("-time").first()

            # Skapa usage history per månad
            usage_history = {
                item["week"].strftime("%Y-%m-%dT%H:%M:%S.%fZ"): item["count"]
                for item in usages_per_week
            }

            # Lägg till statistik i resultatet
            data.append(
                {
                    "id": garment.id,
                    "statistics": {
                        "mean_usage": mean_usage,
                        "total_usage": total_usage,
                        "last_usage": last_usage.time if last_usage else None,
                        "usage_history": usage_history,
                    },
                }
            )

        return Response(data)


class MarketListingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for the public market: shows all listings from all users.
    """

    queryset = Listing.objects.all().annotate(
        garment_size=F("garment__size"),
        garment_color=F("garment__color"),
        garment_category=F("garment__category__name"),
    )
    serializer_class = ListingSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ListingFilter
    ordering_fields = [
        "garment_size",
        "garment_color",
        "garment_category",
        "price",
        "place",
        "payment_method",
    ]
    permission_classes = []
