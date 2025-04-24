from django.contrib.auth.models import Group, User
from rest_framework import serializers
from framework.quickstart.models import Garment, Wardrobe, Usage, Category


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class GarmentSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    owner_username=serializers.CharField(source="owner.username", read_only=True)
    class Meta:
        model = Garment
        fields = [
            "id",
            "name",
            "size",
            "color",
            "wardrobe",
            "brand",
            "category",
            "owner",
            "owner_username"
        ]
        read_only=["owner"]


class WardrobeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Wardrobe
        fields = ["id", "name"]


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]


class UsageSerializer(serializers.ModelSerializer):
    garment = serializers.PrimaryKeyRelatedField(queryset=Garment.objects.all())
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Usage
        fields = [
            "id",
            "garment",
            "time",
            "notes",
            "owner",
            "owner_username",
        ]
        read_only_fields = ["owner"]


class LoginSerializer(serializers.Serializer):
    """
    Serializer which accepts an OAuth2 access token and provider.
    """

    provider = serializers.CharField(max_length=255, required=True)
    access_token = serializers.CharField(
        max_length=4096, required=True, trim_whitespace=True
    )
