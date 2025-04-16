from django.urls import path, include
from django.http import FileResponse
from rest_framework.routers import DefaultRouter
from framework.quickstart.views import GarmentViewSet, WardrobeViewSet, UsageViewSet, GarmentUsageViewSet # LINUS LA TILL 
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework_nested.routers import NestedSimpleRouter # LINUS LA TILL


router = DefaultRouter()
router.register(r"garments", GarmentViewSet, basename="garment")
router.register(r"usages", UsageViewSet, basename="usage")

# LINUS LA TILL
# Nested router för usages
garments_router = NestedSimpleRouter(router, r'garments', lookup='garment')
garments_router.register(r'usages', GarmentUsageViewSet, basename='garment-usages')
# LINUS LA TILL 

def static_schema_view(request):
    import os
    from django.conf import settings

    schema_path = os.path.join(settings.BASE_DIR, "schema_planned.yml")
    return FileResponse(open(schema_path, "rb"), content_type="application/yaml")


urlpatterns = [
    # Swagger
    path(
        "api/docs/current/schema/", SpectacularAPIView.as_view(), name="current_schema"
    ),
    path(
        "api/docs/current/",
        SpectacularSwaggerView.as_view(url_name="current_schema"),
        name="swagger-ui",
    ),
    path("api/docs/planned/schema/", static_schema_view, name="planned_schema"),
    path(
        "api/docs/planned/",
        SpectacularSwaggerView.as_view(url_name="planned_schema"),
        name="swagger-ui",
    ),
    path("api/", include(router.urls)),
    path("api/", include(garments_router.urls)), # LINUS LA TILL 
]
