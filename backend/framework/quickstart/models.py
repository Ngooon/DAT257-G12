from django.db import models


# Create your models here.


class Wardrobe(models.Model):
    name = models.CharField(max_length=100, help_text="Namn på garderoben")

    def __str__(self):
        return self.name


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Category {self.name}"


class Garment(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    wardrobe = models.CharField(max_length=100)
    size = models.CharField(max_length=20, null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True)
    brand = models.CharField(max_length=50, null=True, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="garments",
    )

    def __str__(self):
        return f"{self.name} (Storlek: {self.size}, Färg: {self.color})"


class Usage(models.Model):
    id = models.AutoField(primary_key=True)
    garment = models.ForeignKey(
        Garment, on_delete=models.CASCADE, related_name="usages"
    )
    time = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(null=True, blank=True, help_text="Notes about the usage")

    class Meta:
        unique_together = (
            "garment",
            "time",
        )  # Ensures unique combination of garment and time

    def __str__(self):
        return f"{self.garment.name} used at {self.time.strftime('%Y-%m-%d %H:%M:%S')}"
