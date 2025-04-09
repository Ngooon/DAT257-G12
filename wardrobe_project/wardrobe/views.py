from django.shortcuts import render

from django.shortcuts import render, redirect, get_object_or_404
from .models import ClothingItem, Wardrobe
from .forms import ClothingItemForm

def wardrobe_list(request):
    """Visa listan över alla klädesplagg."""
    items = ClothingItem.objects.all()
    return render(request, "wardrobe/wardrobe_list.html", {"items": items})

def add_clothing_item(request):
    """Lägg till ett nytt klädesplagg."""
    if request.method == "POST":
        form = ClothingItemForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("wardrobe_list")
    else:
        form = ClothingItemForm()
    return render(request, "wardrobe/add_clothing_item.html", {"form": form})

def delete_clothing_item(request, item_id):
    """Ta bort ett klädesplagg."""
    item = get_object_or_404(ClothingItem, id=item_id)
    if request.method == "POST":
        item.delete()
        return redirect("wardrobe_list")
    return render(request, "wardrobe/delete_clothing_item.html", {"item": item})
