from rest_framework import generics
from .models import Photo
from .serializers import PhotoSerializer

# Create + List
class PhotoListCreateView(generics.ListCreateAPIView):
    queryset = Photo.objects.all().order_by("-uploaded_at")
    serializer_class = PhotoSerializer

# Read, Update, Delete a single photo
class PhotoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    lookup_field = 'id'
