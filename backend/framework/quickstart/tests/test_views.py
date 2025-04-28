from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from framework.quickstart.models import Garment, Category, Listing, PaymentMethod
from django.contrib.auth.models import User


class ViewsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

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

    def test_get_garments(self):
        url = reverse("garment-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "T-shirt")

    def test_create_garment(self):
        url = reverse("garment-list")
        data = {
            "name": "Jeans",
            "wardrobe": "Winter",
            "size": "L",
            "color": "Black",
            "brand": "Levi's",
            "category": self.category.id,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Garment.objects.count(), 2)
        self.assertEqual(Garment.objects.last().name, "Jeans")

    def test_unauthenticated_access(self):
        self.client.force_authenticate(user=None)  # Logga ut användaren
        url = reverse("garment-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_garment_creation(self):
        url = reverse("garment-list")
        data = {
            "name": "",  # Invalid name
            "wardrobe": "Winter",
            "size": "L",
            "color": "Black",
            "brand": "Levi's",
            "category": self.category.id,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)