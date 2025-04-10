from django.urls import path
from framework.quickstart.views import garments_view


urlpatterns = [
    path("api/garments/", garments_view, name="garments_view"),
    path("api/garments/<int:pk>/", garments_view, name="garments_view"),
]
