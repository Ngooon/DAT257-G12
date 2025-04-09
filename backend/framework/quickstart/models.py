from django.db import models


# Create your models here.


class Wardrobe(models.Model):
    name = models.CharField(max_length=100, help_text="Namn på garderoben")

    def __str__(self):
        return self.name


class Garment(models.Model):
    wardrobe = models.CharField(max_length=100)
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    size = models.CharField(max_length=20,null=True)
    color = models.CharField(max_length=50,null=True)
    brand = models.CharField(max_length=50,null=True)
    category = models.CharField(max_length=50,null=True)

    def __str__(self):
        return f"{self.name} (Storlek: {self.size}, Färg: {self.color})"
