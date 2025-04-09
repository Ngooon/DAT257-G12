from django.urls import path
from framework.quickstart.views import get_garments, create_garment, update_garment, delete_garment


urlpatterns = [
    path('garments/', get_garments, name='get_garment'),
    path('garments/', create_garment, name='create_garment'),
    path('garments/<int:pk>/', update_garment, name='update_garment'),
    path('garments/<int:pk>/', delete_garment, name='delete_garment'),
]