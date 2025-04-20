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
    UsageSerializer,
    CategorySerializer,
)


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
