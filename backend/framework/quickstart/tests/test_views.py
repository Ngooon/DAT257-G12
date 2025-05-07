from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from framework.quickstart.models import Garment, Category, Listing, PaymentMethod, Usage
from django.contrib.auth.models import User
from datetime import timedelta
from datetime import datetime
from django.utils.timezone import make_aware

from django.utils.timezone import now


class ViewsTestCase(TestCase):
    def setUp(self):
        # Skapa en användare och autentisera
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Hårdkodad testdata
        self.category_top = Category.objects.create(name="Top")
        self.category_outerwear = Category.objects.create(name="Outerwear")
        self.category_footwear = Category.objects.create(name="Footwear")
        self.category_accessory = Category.objects.create(name="Accessory")
        self.category_bottom = Category.objects.create(name="Bottom")

        self.garment_tshirt = Garment.objects.create(
            name="T-shirt",
            wardrobe="Summer",
            size="M",
            color="Blue",
            brand="Nike",
            category=self.category_top,
            owner=self.user,  # Koppla till den autentiserade användaren
        )
        self.garment_sweater = Garment.objects.create(
            name="Sweater",
            wardrobe="Winter",
            size="M",
            color="Red",
            brand="Adidas",
            category=self.category_top,
            owner=self.user,  # Koppla till den autentiserade användaren
        )
        self.garment_jacket = Garment.objects.create(
            name="Jacket",
            wardrobe="Spring",
            size="L",
            color="Green",
            brand="Uniqlo",
            category=self.category_outerwear,
            owner=self.user,  # Koppla till den autentiserade användaren
        )

        self.payment_method_swish = PaymentMethod.objects.create(name="Swish")
        self.payment_method_card = PaymentMethod.objects.create(name="Card")

        self.listing_tshirt = Listing.objects.create(
            garment=self.garment_tshirt,
            description="A comfortable blue T-shirt, perfect for summer.",
            place="Stockholm",
            price=199.99,
            owner=self.user,
            payment_method=self.payment_method_swish,
        )
        self.listing_jeans = Listing.objects.create(
            garment=Garment.objects.create(
                name="Jeans",
                wardrobe="Winter",
                size="L",
                color="Black",
                brand="Levi's",
                category=self.category_bottom,
                owner=self.user,  # Koppla till den autentiserade användaren
            ),
            description="Stylish black jeans, great for casual wear.",
            place="Gothenburg",
            price=299.99,
            owner=self.user,
            payment_method=self.payment_method_card,
        )
        
        now_time = now()
        Usage.objects.create(
            garment=self.garment_tshirt,
            time=now_time - timedelta(days=1),
            notes="Used for a casual outing.",
            owner=self.user,  # Koppla till den autentiserade användaren
        )
        Usage.objects.create(
            garment=self.garment_sweater,
            time=now_time - timedelta(days=2),
            notes="Worn to a meeting.",
            owner=self.user,  # Koppla till den autentiserade användaren
        )
        Usage.objects.create(
            garment=self.garment_jacket,
            time=now_time - timedelta(days=3),
            notes="Perfect for a rainy day.",
            owner=self.user,  # Koppla till den autentiserade användaren
)

        # Hämta exempeldata för tester
        self.category = self.category_top
        self.garment = self.garment_tshirt
        self.payment_method = self.payment_method_swish

    def test_filter_garments_by_size(self):
        url = reverse("garment-list") + "?size=M"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Det finns 2 plagg med storlek "M"
        
    def test_get_categories(self):
        url = reverse("category-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)  # Det finns 5 kategorier i testdatan
        self.assertIn("Top", [category["name"] for category in response.data])

    def test_get_garments(self):
        url = reverse("garment-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)  # Det finns 4 plagg i testdatan
        self.assertIn("T-shirt", [garment["name"] for garment in response.data])

    def test_get_listings(self):
        url = reverse("listing-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Det finns 2 listningar i testdatan
        self.assertIn("A comfortable blue T-shirt, perfect for summer.", [listing["description"] for listing in response.data])

    def test_get_payment_methods(self):
        url = reverse("payment_method-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Det finns 2 betalningsmetoder i testdatan
        self.assertIn("Swish", [method["name"] for method in response.data])

    def test_get_usages(self):
        url = reverse("usage-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # Det finns 3 användningar i testdatan
        self.assertIn("Used for a casual outing.", [usage["notes"] for usage in response.data])

    def test_sort_garments_by_color(self):
        url = reverse("garment-list") + "?ordering=color"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)  # Det finns 4 plagg
        self.assertEqual(response.data[0]["color"], "Black")  # Första färgen i sorteringen
        self.assertEqual(response.data[-1]["color"], "Red")  # Sista färgen i sorteringen

    def test_filter_listings_by_price(self):
        url = reverse("listing-list") + "?min_price=100&max_price=200"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["price"], "199.99")

    def test_sort_listings_by_price(self):
        url = reverse("listing-list") + "?ordering=price"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Det finns 2 listningar
        self.assertEqual(response.data[0]["price"], "199.99")  # Lägsta priset först
        self.assertEqual(response.data[1]["price"], "299.99")  # Nästa pris

    def test_create_listing(self):
        url = reverse("listing-list")
        data = {
            "garment": self.garment_jacket.id,
            "description": "A brand new listing",
            "place": "Stockholm",
            "price": 399.99,
            "payment_method": self.payment_method.id,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Listing.objects.count(), 3)  # Det finns nu 3 listningar
        self.assertEqual(Listing.objects.last().description, "A brand new listing")

    def test_invalid_listing_creation(self):
        url = reverse("listing-list")
        data = {
            "garment": self.garment.id,  # Detta plagg har redan en listning
            "description": "Invalid listing",
            "place": "Stockholm",
            "price": -10.00,  # Ogiltigt pris
            "payment_method": self.payment_method.id,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("price", response.data)
    
    def test_statistics_all_categories(self):
        url = reverse("statistics-category")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)  # Fem kategorier ska returneras, även de utan usages

        for category in response.data:
            self.assertIn("id", category)
            self.assertIn("statistics", category)
            self.assertIn("mean_usage", category["statistics"])
            self.assertIn("total_usage", category["statistics"])
            self.assertIn("last_usage", category["statistics"])
            self.assertIn("usage_history", category["statistics"])

    def test_statistics_specific_category(self):
        url = reverse("statistics-category") + f"?id={self.category_top.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Endast en kategori ska returneras
        category = response.data[0]
        self.assertEqual(category["id"], self.category_top.id)
        self.assertIn("statistics", category)
        self.assertIn("mean_usage", category["statistics"])
        self.assertIn("total_usage", category["statistics"])
        self.assertIn("last_usage", category["statistics"])
        self.assertIn("usage_history", category["statistics"])

    def test_statistics_category_date_filter(self):
        from_time = (now() - timedelta(days=2)).strftime("%Y-%m-%dT%H:%M:%S") 
        to_time = now().strftime("%Y-%m-%dT%H:%M:%S") 
        url = reverse("statistics-category") + f"?from_time={from_time}&to_time={to_time}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
            
        for category in response.data:
            self.assertIn("id", category)
            self.assertIn("statistics", category)
            self.assertIn("mean_usage", category["statistics"])
            self.assertIn("total_usage", category["statistics"])
            self.assertIn("last_usage", category["statistics"])
            self.assertIn("usage_history", category["statistics"])

    def test_statistics_no_usages(self):
        # Skapa en kategori utan användningar
        category_empty = Category.objects.create(name="Empty Category")
        url = reverse("statistics-category") + f"?id={category_empty.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        category = response.data[0]
        self.assertEqual(category["id"], category_empty.id)
        self.assertEqual(category["statistics"]["total_usage"], 0)
        self.assertEqual(category["statistics"]["mean_usage"], 0)
        self.assertIsNone(category["statistics"]["last_usage"])
        self.assertEqual(len(category["statistics"]["usage_history"]), 0)