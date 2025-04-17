from rest_framework import viewsets
from framework.quickstart.models import Garment, Wardrobe
from framework.quickstart.serializers import (
    GarmentSerializer,
    WardrobeSerializer,
    LoginSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


import requests
from django.http import HttpResponseRedirect, JsonResponse
from django.conf import settings
from urllib.parse import urlencode

# Put your Facebook App details in Django settings.py
FACEBOOK_APP_ID = settings.SOCIAL_AUTH_FACEBOOK_KEY
FACEBOOK_APP_SECRET = settings.SOCIAL_AUTH_FACEBOOK_SECRET
REDIRECT_URI = 'http://localhost:8000/auth/facebook/callback'
FRONTEND_REDIRECT = 'http://localhost:4200/wardrobe'  # Where Angular should land after login

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
    params = urlencode({"name": user_data.get("name", "Unknown")})
    return HttpResponseRedirect(f"{FRONTEND_REDIRECT}?{params}")

class GarmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for garments.
    """

    queryset = Garment.objects.all()
    serializer_class = GarmentSerializer


class WardrobeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for wardrobes.
    """

    queryset = Wardrobe.objects.all()
    serializer_class = WardrobeSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        provider = serializer.validated_data["provider"]
        access_token = serializer.validated_data["access_token"]

        return Response({"message": f"Logged in with {provider}!"}, status=status.HTTP_200_OK)
    
