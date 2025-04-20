import django_filters
from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Count
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from framework.quickstart.models import Garment, Wardrobe, Usage, Category
from framework.quickstart.serializers import (
    GarmentSerializer,
    WardrobeSerializer,
    LoginSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import redirect

import requests
from django.http import HttpResponseRedirect, JsonResponse
from django.conf import settings
from urllib.parse import urlencode

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
    token = generate_token(user_data)
    return redirect(f"http://localhost:4200/?token={token}")


def generate_token(user_data):
    payload = {
        "id": user_data["id"],
        "name": user_data["name"],
        "email": user_data.get("email", ""),
        "exp": datetime.utcnow() + timedelta(hours=24),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token


def protected_view(request):
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return JsonResponse({"message": f"Welcome {payload['name']}!"})
    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Token expired"}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({"error": "Invalid token"}, status=401)


class GarmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for garments.
    """

    queryset = Garment.objects.all().annotate(usage_count=Count("usages"))
    serializer_class = GarmentSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend]  # Lägg till OrderingFilter
    ordering_fields = ["size", "color", "category", "usage_count"]
    filterset_fields = ["size", "color", "category"]


class GarmentUsageViewSet(viewsets.ViewSet):
    """
    API endpoint for usages related to a specific garment.
    """

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
        usages = Usage.objects.filter(garment_id=garment_pk)

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

    queryset = Wardrobe.objects.all()
    serializer_class = WardrobeSerializer


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

    class Meta:
        model = Usage
        fields = ["garment_id", "from_time", "to_time"]


class UsageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for usages.
    """

    queryset = Usage.objects.all().order_by("-time")
    serializer_class = UsageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UsageFilter
