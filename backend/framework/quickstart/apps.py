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
        

