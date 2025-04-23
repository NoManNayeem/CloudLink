from django.db import models

class Photo(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


    def delete(self, *args, **kwargs):
        # Delete the file from S3
        if self.image:
            self.image.delete(save=False)
        super().delete(*args, **kwargs)