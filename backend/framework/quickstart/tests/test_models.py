from django.test import TestCase
from framework.quickstart.models import Garment, Category, Usage, PaymentMethod, Listing, Wardrobe
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError

class SimpleTestCase(TestCase):
    def test_example(self):
        self.assertEqual(1 + 1, 2)

class ModelsTestCase(TestCase):
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

    def test_category_str(self):
        self.assertEqual(str(self.category), "Category Top")

    def test_garment_str(self):
        self.assertEqual(str(self.garment), "T-shirt (Storlek: M, Färg: Blue)")

    def test_listing_creation(self):
        listing = Listing.objects.create(
            garment=self.garment,
            description="A comfortable blue T-shirt",
            place="Stockholm",
            price=199.99,
            payment_method=self.payment_method,
        )
        self.assertEqual(str(listing), "T-shirt listed for sale")

    def test_duplicate_category(self):
        with self.assertRaises(IntegrityError):
            Category.objects.create(name="Top")

    def test_usage_creation(self):
        usage = Usage.objects.create(
            garment=self.garment,
            time=now(),
            notes="Worn during a meeting",
            owner=self.user,
        )
        self.assertEqual(
            str(usage), f"{self.garment.name} used at {usage.time.strftime('%Y-%m-%d %H:%M:%S')}"
        )

    def test_listing_price_validation(self):
        listing = Listing(
            garment=self.garment,
            description="Invalid price",
            place="Stockholm",
            price=-10.00,  # Negativt pris
            payment_method=self.payment_method,
        )
        with self.assertRaises(ValidationError):
            listing.full_clean()  
            listing.save()
        
