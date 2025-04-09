from django.db import models

# Create your models here.

class Wardrobe(models.Model):
    name = models.CharField(max_length=100, help_text="Namn på garderoben")

    def __str__(self):
        return self.name

class ClothingItem(models.Model):
    wardrobe = models.ForeignKey(Wardrobe, on_delete=models.CASCADE, related_name="clothing_items", null=True, blank=True)
    name = models.CharField(max_length=100, help_text="Klädesplaggets namn")
    size = models.CharField(max_length=20, help_text="Storlek, t.ex. S, M, L")
    color = models.CharField(max_length=50, help_text="Färg på plagget")



    def __str__(self):
        return f"{self.name} (Storlek: {self.size}, Färg: {self.color})"