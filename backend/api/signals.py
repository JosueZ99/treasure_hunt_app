from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Leaderboard

@receiver(post_save, sender=CustomUser)
def create_related_records(sender, instance, created, **kwargs):
    """
    Cuando se crea un nuevo usuario, crea automáticamente registros relacionados.
    """
    if created:
        # Crear una entrada en Leaderboard para el usuario con puntos iniciales en 0
        Leaderboard.objects.create(user=instance)
