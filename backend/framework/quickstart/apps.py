from django.apps import AppConfig
from django.db import connection

class QuickstartConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "framework.quickstart"
    
    def ready(self):
        from django.apps import apps

        # Kontrollera om tabellen auth_user existerar
        if "auth_user" in connection.introspection.table_names():
            # Hämta User-modellen
            User = apps.get_model("auth", "User")
            
            # Skapa en superuser om den inte redan finns
            if not User.objects.filter(username="test_user1").exists():
                User.objects.create_superuser(
                    username="test_user1",
                    email="admin@example.com",
                    password="123abc"
                )
                print("Superuser 'test_user1' created successfully")
            # Skapa en superuser om den inte redan finns
            if not User.objects.filter(username="test_user2").exists():
                User.objects.create_superuser(
                    username="test_user2",
                    email="admin@example.com",
                    password="123abc"
                )
                print("Superuser 'test_user2' created successfully")

