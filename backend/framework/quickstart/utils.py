from django.db import models
from .models import Wardrobe, Garment


def flush_wardrobe_data():

    Wardrobe.objects.all().delete()
    Garment.objects.all().delete()


def create_example_data():

    example_garments = [
        {
            "name": "T-shirt",
            "wardrobe": "Summer",
            "size": "M",
            "color": "Blue",
            "brand": "Nike",
            "category": "Top",
        },
        {
            "name": "Jeans",
            "wardrobe": "Winter",
            "size": "L",
            "color": "Black",
            "brand": "Levi's",
            "category": "Bottom",
        },
        {
            "name": "Jacket",
            "wardrobe": "Autumn",
            "size": "XL",
            "color": "Green",
            "brand": "Adidas",
            "category": "Outerwear",
        },
        {
            "name": "Sweater",
            "wardrobe": "Winter",
            "size": "M",
            "color": "Gray",
            "brand": "H&M",
            "category": "Top",
        },
        {
            "name": "Shorts",
            "wardrobe": "Summer",
            "size": "S",
            "color": "Red",
            "brand": "Puma",
            "category": "Bottom",
        },
        {
            "name": "Raincoat",
            "wardrobe": "Spring",
            "size": "L",
            "color": "Yellow",
            "brand": "Columbia",
            "category": "Outerwear",
        },
        {
            "name": "Scarf",
            "wardrobe": "Winter",
            "size": None,
            "color": "White",
            "brand": "Gucci",
            "category": "Accessory",
        },
        {
            "name": "Hat",
            "wardrobe": "Summer",
            "size": None,
            "color": "Beige",
            "brand": "Zara",
            "category": "Accessory",
        },
        {
            "name": "Sneakers",
            "wardrobe": "All Seasons",
            "size": "42",
            "color": "White",
            "brand": "Converse",
            "category": "Footwear",
        },
        {
            "name": "Boots",
            "wardrobe": "Winter",
            "size": "43",
            "color": "Brown",
            "brand": "Timberland",
            "category": "Footwear",
        },
    ]

    for data in example_garments:
        Garment.objects.get_or_create(**data)
