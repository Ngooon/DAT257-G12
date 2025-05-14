from django.contrib import admin
from .models import Listing, Garment

# Registrera Listing-modellen
@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "garment", "price", "place", "owner")  # Kolumner att visa
    search_fields = ("garment__name", "owner__username")  # Sökbara fält
    list_filter = ("price", "place")  # Filteralternativ

# Registrera Garment-modellen
@admin.register(Garment)
class GarmentAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "size", "color", "category", "owner")
    search_fields = ("name", "owner__username")
    list_filter = ("size", "color", "category")
