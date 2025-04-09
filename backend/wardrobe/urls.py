from django.urls import path
from . import views

urlpatterns = [
    path("", views.wardrobe_list, name="wardrobe_list"),
    path("add/", views.add_clothing_item, name="add_clothing_item"),
    path("delete/<int:item_id>/", views.delete_clothing_item, name="delete_clothing_item"),
]