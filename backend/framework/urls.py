from django.urls import path, include
from django.http import FileResponse
from rest_framework.routers import DefaultRouter
from framework.quickstart.views import GarmentViewSet, WardrobeViewSet, LoginView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from django.urls import path




router = DefaultRouter()
router.register(r"garments", GarmentViewSet, basename="garment")


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
    
    #Facebook login
    #path('oauth/login/', LoginViewSet.as_view({'get': 'list', 'post': 'create'})),
    #path('api/auth/oauth/', include('rest_framework_social_oauth2.urls'))
    #path('api/auth/facebook-login/', LoginView.as_view(), name='facebook-login'),
    path('auth/', include('social_django.urls', namespace='social')),
]
