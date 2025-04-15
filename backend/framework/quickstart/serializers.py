from django.contrib.auth.models import Group, User
from rest_framework import serializers
from framework.quickstart.models import Garment, Wardrobe, Usage


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class GarmentSerializer(serializers.HyperlinkedModelSerializer):
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
        ]

class WardrobeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Wardrobe
        fields = ['id', 'name']


class UsageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Usage
        fields = [
            "garment",
            "time",
            "notes",
        ]
