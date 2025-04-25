from django.contrib.auth.models import Group, User
from rest_framework import serializers
from framework.quickstart.models import Garment, Wardrobe, Usage, Category, PaymentMethod, Listing


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
    usage_count = serializers.IntegerField(source='usages.count', read_only=True) 
    
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
            "usage_count",
        ]


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

    class Meta:
        model = Usage
        fields = [
            "id",
            "garment",
            "time",
            "notes",
        ]


class LoginSerializer(serializers.Serializer):
    """
    Serializer which accepts an OAuth2 access token and provider.
    """

    provider = serializers.CharField(max_length=255, required=True)
    access_token = serializers.CharField(
        max_length=4096, required=True, trim_whitespace=True
    )


class PaymentMethodSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PaymentMethod
        fields = [
            "id",
            "name",
        ]



class ListingSerializer(serializers.ModelSerializer):
    garment = serializers.PrimaryKeyRelatedField(queryset=Garment.objects.all())
    payment_method = serializers.PrimaryKeyRelatedField(queryset=PaymentMethod.objects.all())

    class Meta:
        model = Listing
        fields = [
            "id",
            "garment",
            "description",
            "time",
            "place",
            "price",
            "payment_method",
        ]

    def validate(self, data):
        # Kontrollera om en listing redan existerar för samma garment
        garment = data.get("garment")
        if Listing.objects.filter(garment=garment).exists():
            raise serializers.ValidationError({"garment": "A listing for this garment already exists."})

        # Kontrollera om priset är för högt
        price = data.get("price")
        MAX_PRICE = 9999999999  # Exempel på maxpris
        if price and price > MAX_PRICE:
            raise serializers.ValidationError({"price": f"Price cannot exceed {MAX_PRICE}."})
        if price and price < 0:
            raise serializers.ValidationError({"price": "Price cannot be negative."})

        return data