from django.urls import path
from framework.quickstart.views import (
    get_garments,
    create_garment,
    update_garment,
    delete_garment,
    garments_view,
)


urlpatterns = [
    path("garments/", garments_view, name="garments_view"),
    # path("garments/", create_garment, name="get_garment"),
    # path("garments/create/", create_garment, name="create_garment"),
    path("garments/<int:pk>/", garments_view, name="garments_view"),
    # path("garments/<int:pk>/", garments_view, name="delete_garment"),
]
