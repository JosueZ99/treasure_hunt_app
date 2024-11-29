from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError("El correo electrónico es obligatorio")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.create_user(email, first_name, last_name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # Usamos el email como campo principal para la autenticación
    REQUIRED_FIELDS = ['first_name', 'last_name']  # Campos obligatorios al crear un superusuario

    def __str__(self):
        return self.email
    
# Modelo Location
class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Nombre único de la ubicación
    description = models.TextField(blank=True, null=True)  # Descripción opcional
    qr_code = models.CharField(max_length=100, unique=True)  # Código QR asociado
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación

    def __str__(self):
        return self.name

# Modelo Challenge
class Challenge(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="challenges")  # Ubicación asociada
    question = models.TextField()  # Pregunta del desafío
    correct_answer = models.CharField(max_length=255)  # Respuesta correcta
    points = models.PositiveIntegerField(default=10)  # Puntos otorgados por resolverlo

    def __str__(self):
        return f"Challenge at {self.location.name}"

# Modelo Hint
class Hint(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="hints")  # Ubicación asociada
    text = models.TextField()  # Texto educativo o pista
    order = models.PositiveIntegerField()  # Orden de las pistas

    class Meta:
        unique_together = ('location', 'order')  # Cada pista debe ser única por ubicación y orden

    def __str__(self):
        return f"Hint {self.order} for {self.location.name}"

# Modelo UserProgress
class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Usuario asociado
    location = models.ForeignKey(Location, on_delete=models.CASCADE)  # Ubicación alcanzada
    completed = models.BooleanField(default=False)  # Si completó el desafío en esta ubicación
    points_earned = models.PositiveIntegerField(default=0)  # Puntos obtenidos
    completed_at = models.DateTimeField(auto_now_add=True)  # Fecha de completado

    def __str__(self):
        return f"{self.user.email} - {self.location.name}"

# Modelo Leaderboard
class Leaderboard(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Usuario único
    total_points = models.PositiveIntegerField(default=0)  # Puntos acumulados

    def __str__(self):
        return f"{self.user.email}: {self.total_points} pts"

# Modelo ParticipationHistory
class ParticipationHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Usuario asociado
    location = models.ForeignKey(Location, on_delete=models.CASCADE)  # Ubicación asociada
    action = models.CharField(max_length=50)  # Acción realizada (por ejemplo: "Scanned QR", "Completed Challenge")
    timestamp = models.DateTimeField(auto_now_add=True)  # Fecha y hora de la acción

    def __str__(self):
        return f"{self.user.email} - {self.action} at {self.timestamp}"