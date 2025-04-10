# Generated by Django 5.0 on 2025-04-09 12:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0002_garment_brand_garment_category_alter_garment_color_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='garment',
            name='wardrobe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='garment', to='quickstart.wardrobe'),
        ),
    ]
