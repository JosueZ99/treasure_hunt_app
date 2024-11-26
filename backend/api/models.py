from django.db import models

class QRCode(models.Model):
    name = models.CharField(max_length=100)
    data = models.TextField()  # Contenido del QR, por ejemplo, pistas
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
