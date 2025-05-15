from django.apps import AppConfig
from django.db import connection
from django.db.utils import OperationalError

class QuickstartConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "framework.quickstart"
    
    def ready(self):
        from django.apps import apps

        User = apps.get_model("auth", "User")

        try:
            # Kontrollera om tabellen auth_user existerar
            if not User.objects.filter(username="admin").exists():
                # Skapa en superuser om den inte redan finns
                User.objects.create_superuser(
                    username="admin",
                    email="admin@example.com",
                    password="admin123"
                )
                print("Superuser 'admin' created successfully.")
        except OperationalError:
            # Detta hanterar fallet där migreringar inte har körts ännu
            print("Database not ready. Skipping superuser creation.")
        

