from django.contrib.auth.models import Group, User
from rest_framework import serializers
from framework.quickstart.models import (
    Garment,
    Usage,
    Category,
    PaymentMethod,
    Listing,
    Rating

)


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'rater', 'rated_user', 'score', 'timestamp']
        read_only_fields = ['rater', 'timestamp']

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username","first_name", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]


class GarmentSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    usage_count = serializers.SerializerMethodField()

    def get_usage_count(self, obj):
        # Använder annoterat värde om det finns, annars räknar alla
        return getattr(obj, "usage_count", obj.usages.count())

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
            "owner_username",
            "usage_count",
        ]
        read_only = ["owner"]

    def to_representation(self, instance):
        """Customize the output for the 'category' field."""
        representation = super().to_representation(instance)
        category_instance = instance.category
        if category_instance:
            representation["category"] = CategorySerializer(category_instance).data
        return representation


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

    def to_representation(self, instance):
        """Customize the output for the 'garment' field."""
        representation = super().to_representation(instance)
        garment_instance = instance.garment
        if garment_instance:
            representation["garment"] = GarmentSerializer(garment_instance).data
        return representation


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
    payment_method = serializers.PrimaryKeyRelatedField(
        queryset=PaymentMethod.objects.all()
    )
    #owner_username = serializers.CharField(source="owner.username", read_only=True)
    owner = UserSerializer(read_only=True)

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
            "owner",
        ]
        read_only_fields = ["owner"]

    def to_representation(self, instance):
        """Customize the output for the 'garment' and 'payment_method' fields."""
        representation = super().to_representation(instance)

        # Customize 'garment' field
        garment_instance = instance.garment
        if garment_instance:
            representation["garment"] = GarmentSerializer(garment_instance).data

        # Customize 'payment_method' field
        payment_method_instance = instance.payment_method
        if payment_method_instance:
            representation["payment_method"] = PaymentMethodSerializer(
                payment_method_instance
            ).data

        return representation
    

    def validate(self, data):
        # Kontrollera om en listing redan existerar för samma garment
        garment = data.get("garment")
        if Listing.objects.filter(garment=garment).exists():
            raise serializers.ValidationError(
                {"garment": "A listing for this garment already exists."}
            )

        # Kontrollera om priset är för högt
        price = data.get("price")
        MAX_PRICE = 9999999999  # Exempel på maxpris
        if price and price > MAX_PRICE:
            raise serializers.ValidationError(
                {"price": f"Price cannot exceed {MAX_PRICE}."}
            )
        if price and price < 0:
            raise serializers.ValidationError({"price": "Price cannot be negative."})

        return data


