from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.core.validators import MinValueValidator, MaxValueValidator



# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    average_rating = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Profile of {self.user.username}"

class Rating(models.Model):
    rater = models.ForeignKey(User, on_delete=models.CASCADE, related_name="given_ratings")
    rated_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_ratings")
    score = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('rater', 'rated_user')  # Each user can rate another only once

    def __str__(self):
        return f"{self.rater.username} rated {self.rated_user.username}: {self.score}"

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

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
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="garments"
    )

    def __str__(self):
        return f"{self.name} (Storlek: {self.size}, Färg: {self.color})"


class Usage(models.Model):
    id = models.AutoField(primary_key=True)
    garment = models.ForeignKey(
        Garment, on_delete=models.CASCADE, related_name="usages"
    )
    time = models.DateTimeField(default=now)
    notes = models.TextField(null=True, blank=True, help_text="Notes about the usage")

    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="usage"
    )

    class Meta:
        unique_together = (
            "garment",
            "time",
            "owner",
        )  # Ensures unique combination of garment and time and owner

    def __str__(self):
        return f"{self.garment.name} used at {self.time.strftime('%Y-%m-%d %H:%M:%S')}"


class PaymentMethod(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Payment method {self.name}"


class Listing(models.Model):
    id = models.AutoField(primary_key=True)
    garment = models.ForeignKey(
        Garment, on_delete=models.CASCADE, unique=True, related_name="listings"
    )
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="listing"
    )
    description = models.TextField(
        null=True, blank=True, help_text="Describe the garment"
    )
    time = models.DateTimeField(auto_now_add=True, null=True)
    place = models.CharField(
        max_length=100, null=True, help_text="Place where the garment is listed"
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, help_text="Price of the garment", validators=[MinValueValidator(0)]
    )

    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="listings",
    )

    def __str__(self):
        return f"{self.garment.name} listed for sale"
