from django.test import TestCase
from framework.quickstart.models import Garment, Category, PaymentMethod, Listing
from framework.quickstart.serializers import GarmentSerializer, ListingSerializer
from django.contrib.auth.models import User


class SerializersTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.category = Category.objects.create(name="Top")
        self.garment = Garment.objects.create(
            name="T-shirt",
            wardrobe="Summer",
            size="M",
            color="Blue",
            brand="Nike",
            category=self.category,
            owner=self.user,
        )
        self.payment_method = PaymentMethod.objects.create(name="Swish")

    def test_garment_serializer(self):
        serializer = GarmentSerializer(instance=self.garment)
        self.assertEqual(serializer.data["name"], "T-shirt")
        self.assertEqual(serializer.data["category"], self.category.id)

    def test_listing_serializer_validation(self):
        data = {
            "garment": self.garment.id,
            "description": "A comfortable blue T-shirt",
            "place": "Stockholm",
            "price": 199.99,
            "payment_method": self.payment_method.id,
        }
        serializer = ListingSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_listing_serializer(self):
        data = {
            "garment": self.garment.id,
            "description": "A comfortable blue T-shirt",
            "place": "Stockholm",
            "price": -50.00,  # Invalid price
            "payment_method": self.payment_method.id,
        }
        serializer = ListingSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("price", serializer.errors)