from django.urls import path
from .views import PhotoListCreateView, PhotoDetailView

urlpatterns = [
    path('photos/', PhotoListCreateView.as_view(), name='photo-list-create'),
    path('photos/<int:id>/', PhotoDetailView.as_view(), name='photo-detail'),
]
