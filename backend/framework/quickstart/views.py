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
    
