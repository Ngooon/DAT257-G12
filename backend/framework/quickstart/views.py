from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
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
    ordering_fields = [ "size", "color", "category","usage_count"]  # Tillåtna fält för sortering

    def get_queryset(self):
        """
        Annotate each garment with the count of its usages.
        """
        return Garment.objects.annotate(usage_count=Count("usages"))


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

    
    def retrieve(self, request, *args, **kwargs):
        """
        Override the default retrieve behavior to return all usages
        with a garment_id matching the provided {id}.
        """
        garment_id = kwargs.get("pk")  # Hämta {id} från URL:en
        usages = self.get_queryset().filter(garment__id=garment_id)  # Filtrera på garment_id
        serializer = self.get_serializer(usages, many=True)  # Serialisera flera objekt
        return Response(serializer.data)

    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="garment_id",
                description="ID of the garment associated with the usage",
                required=True,
                type=int,
            ),
            OpenApiParameter(
                name="time",
                description="Timestamp of the usage to delete (ISO 8601 format)",
                required=True,
                type=str,
            ),
        ],
        responses={
            204: "Usage deleted successfully",
            400: "Bad Request - Missing parameters",
            404: "Not Found - Usage not found",
        },
    )
    
    @action(detail=False, methods=["delete"])
    def delete_by_keys(self, request):
        """
        Delete a Usage based on garment and time.
        """
        garment_id = request.query_params.get("garment_id")
        time = request.query_params.get("time")

        if not garment_id or not time:
            return Response({"error": "garment_id and time are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usage = Usage.objects.get(garment_id=garment_id, time=time)
            usage.delete()
            return Response({"message": "Usage deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Usage.DoesNotExist:
            return Response({"error": "Usage not found"}, status=status.HTTP_404_NOT_FOUND)