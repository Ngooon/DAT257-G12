from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


from framework.quickstart.models import Garment, Wardrobe
from framework.quickstart.serializers import GroupSerializer, UserSerializer, GarmentSerializer, WardrobeSerializer




class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer

class GarmentView(viewsets.ModelViewSet):
    """
    API endpoint that allows garments to be viewed.
    """
    queryset = Garment.objects.all().order_by('name')
    serializer_class = GarmentSerializer

class WardrobeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows wardrobes to be created, updated, delted.
    """
    queryset = Wardrobe.objects.all().order_by('name')
    serializer_class = WardrobeSerializer

@api_view(['GET'])
def get_garments(request):
    """
    API endpoint that allows garments to be viewed.
    """
    garments = Garment.objects.all()
    serializer = GarmentSerializer(garments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_garment(request):
    """
    API endpoint that allows garments to be added.
    """
    serializer = GarmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_garment(request, pk):
    """
    API endpoint that allows garments to be updated.
    """
    try:
        garment = Garment.objects.get(id=pk)
    except Garment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = GarmentSerializer(garment, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_garment(request, pk):
    """
    API endpoint that allows garments to be deleted.
    """
    try:
        garment = Garment.objects.get(id=pk)
    except Garment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    garment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)