from django.db import models
from .models import  Garment, Usage, Category, PaymentMethod, Listing, User
from django.utils.timezone import now, timedelta


def flush_wardrobe_data():

    Garment.objects.all().delete()
    Usage.objects.all().delete()


def create_example_data():

    superuser = User.objects.filter(is_superuser=True, username="test_user1").first()
    if not superuser:
        print("Ingen superuser hittades. Skapa en superuser först.")
        return

    example_categories = [
        {"name": "Top"},
        {"name": "Bottom"},
        {"name": "Outerwear"},
        {"name": "Accessory"},
        {"name": "Footwear"},
    ]

    for category_data in example_categories:
        Category.objects.get_or_create(**category_data)


    example_garments = [
        {
            "name": "T-shirt",
            "wardrobe": "Summer",
            "size": "M",
            "color": "Blue",
            "brand": "Nike",
            "category": Category.objects.get(name="Top"),
        },
        {
            "name": "Jeans",
            "wardrobe": "Winter",
            "size": "L",
            "color": "Black",
            "brand": "Levi's",
            "category": Category.objects.get(name="Bottom"),
        },
        {
            "name": "Jacket",
            "wardrobe": "Autumn",
            "size": "XL",
            "color": "Green",
            "brand": "Adidas",
            "category": Category.objects.get(name="Outerwear"),
        },
        {
            "name": "Sweater",
            "wardrobe": "Winter",
            "size": "M",
            "color": "Gray",
            "brand": "H&M",
            "category": Category.objects.get(name="Top"),
        },
        {
            "name": "Shorts",
            "wardrobe": "Summer",
            "size": "S",
            "color": "Red",
            "brand": "Puma",
            "category": Category.objects.get(name="Bottom"),
        },
        {
            "name": "Raincoat",
            "wardrobe": "Spring",
            "size": "L",
            "color": "Yellow",
            "brand": "Columbia",
            "category": Category.objects.get(name="Outerwear"),
        },
        {
            "name": "Scarf",
            "wardrobe": "Winter",
            "size": None,
            "color": "White",
            "brand": "Gucci",
            "category": Category.objects.get(name="Accessory"),
        },
        {
            "name": "Hat",
            "wardrobe": "Summer",
            "size": None,
            "color": "Beige",
            "brand": "Zara",
            "category": Category.objects.get(name="Accessory"),
        },
        {
            "name": "Sneakers",
            "wardrobe": "All Seasons",
            "size": "42",
            "color": "White",
            "brand": "Converse",
            "category": Category.objects.get(name="Footwear"),
        },
        {
            "name": "Boots",
            "wardrobe": "Winter",
            "size": "43",
            "color": "Brown",
            "brand": "Timberland",
            "category": Category.objects.get(name="Footwear"),
        },
    ]

    for data in example_garments:
        Garment.objects.get_or_create( owner = superuser,**data)

    garments = Garment.objects.all()
    example_usages = [
        {
            "garment": garments[0],
            "time": now() - timedelta(days=1),
            "notes": "Used for a casual outing.",
            "owner": superuser,
        },
        {
            "garment": garments[1],
            "time": now() - timedelta(days=2),
            "notes": "Worn to a meeting.",
            "owner": superuser,
        },
        {
            "garment": garments[2],
            "time": now() - timedelta(days=3),
            "notes": "Perfect for a rainy day.",
            "owner": superuser,
        },
        {
            "garment": garments[3],
            "time": now() - timedelta(days=4),
            "notes": "Worn during a winter walk.",
            "owner": superuser,
        },
        {
            "garment": garments[4],
            "time": now() - timedelta(days=5),
            "notes": "Used for a summer picnic.",
            "owner": superuser,
        },
        {
            "garment": garments[4],
            "time": now() - timedelta(days=6),
            "notes": "Used for a summer walk.",
            "owner": superuser,
        },
    ]

    for usage_data in example_usages:
        Usage.objects.get_or_create(**usage_data)

    example_payment_methods = [
        {"name": "Swish"},
        {"name": "Cash"},
    ]

    for payment_method_data in example_payment_methods:
        PaymentMethod.objects.get_or_create(**payment_method_data)

    payment_methods = PaymentMethod.objects.all()
    example_listings = [
        {
            "garment": garments[0],
            "description": "A comfortable blue T-shirt, perfect for summer.",
            "place": "Stockholm",
            "price": 199.99,
            "payment_method": payment_methods[0],
        },
        {
            "garment": garments[1],
            "description": "Stylish black jeans, great for casual wear.",
            "place": "Gothenburg",
            "price": 499.99,
            "payment_method": payment_methods[1],
        },
    ]

    for listing_data in example_listings:
        Listing.objects.get_or_create(**listing_data)