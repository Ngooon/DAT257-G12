from rest_framework import viewsets
from framework.quickstart.models import Garment, Wardrobe
from framework.quickstart.serializers import (
    GarmentSerializer,
    WardrobeSerializer,
)


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
