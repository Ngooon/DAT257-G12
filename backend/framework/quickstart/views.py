from rest_framework import viewsets
from django.utils.dateparse import parse_datetime
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from framework.quickstart.models import Garment, Wardrobe, Usage
from framework.quickstart.serializers import (
    GarmentSerializer,
    WardrobeSerializer,
    UsageSerializer,
)


class GarmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for garments.
    """

    queryset = Garment.objects.all()
    serializer_class = GarmentSerializer
    filter_backends = [OrderingFilter]  # Lägg till OrderingFilter
    ordering_fields = [ "size", "color", "category","usage_count"]  # Lägg till usage_count som ett sorteringsfält


    def get_queryset(self):
        """
        Annotate each garment with the count of its usages.
        """
        return Garment.objects.annotate(usage_count=Count("usages"))

class GarmentUsageViewSet(viewsets.ViewSet):  # LINUS LA T
    """
    API endpoint for usages related to a specific garment.
    """

    def list(self, request, garment_pk=None):
            """
            List all usages for a specific garment.
            """
            usages = Usage.objects.filter(garment_id=garment_pk)
            serializer = UsageSerializer(usages, many=True, context={'request': request})  # Lägg till context
            return Response(serializer.data)

class WardrobeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for wardrobes.
    """

    queryset = Wardrobe.objects.all()
    serializer_class = WardrobeSerializer


class UsageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for usages.
    """
    queryset = Usage.objects.all()
    serializer_class = UsageSerializer
    filter_backends = [OrderingFilter]  # Lägg till OrderingFilter

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="garment_id",
                description="Filter usages by garment ID",
                required=False,
                type=OpenApiTypes.INT,
            ),
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

    def get_queryset(self):
        """
        Optionally restricts the returned usages to a specific garment,
        by filtering against a `garment_id` query parameter in the URL.
        """
        queryset = super().get_queryset()  # Hämta standardqueryset
        garment_id = self.request.query_params.get('garment_id')  # Hämta garment_id från query-parametrarna
        
        if garment_id:
            queryset = queryset.filter(garment__id=garment_id)
        
        from_time = self.request.query_params.get('from_time')
        if from_time:
            from_time_parsed = parse_datetime(from_time)
            if from_time_parsed:
                queryset = queryset.filter(time__gte=from_time_parsed)

        to_time = self.request.query_params.get('to_time')
        if to_time:
            to_time_parsed = parse_datetime(to_time)
            if to_time_parsed:
                queryset = queryset.filter(time__lte=to_time_parsed)
        return queryset

    


    
