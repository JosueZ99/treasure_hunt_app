from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid
from datetime import timedelta
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError("El correo electrónico es obligatorio")
        email = self.normalize_email(email).lower()
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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

# Modelo Location
class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    qr_code = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Modelo Challenge
class Challenge(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="challenges")
    question = models.TextField()
    correct_answer = models.CharField(max_length=255)
    points = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"Challenge at {self.location.name}"

# Modelo Hint
class Hint(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="hints")
    text = models.TextField()
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('location', 'order')

    def __str__(self):
        return f"Hint {self.order} for {self.location.name}"

# Modelo UserProgress
class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    current_hint = models.PositiveIntegerField(default=1)
    completed = models.BooleanField(default=False)
    points_earned = models.PositiveIntegerField(default=0)
    last_scanned_qr = models.ForeignKey(Location, related_name="user_last_scanned_qr", on_delete=models.SET_NULL, null=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.location.name}"

# Modelo Leaderboard
class Leaderboard(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_points = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.email}: {self.total_points} pts"

# Modelo ParticipationHistory
class ParticipationHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    action = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.action} at {self.timestamp}"

# Modelo QRAccessToken
def get_expiration_time():
    return timezone.now() + timedelta(minutes=15)

class QRAccessToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=get_expiration_time)

    def is_valid(self):
        return timezone.now() < self.expires_at

    def __str__(self):
        return f"Token for {self.user.email} - {self.location.name}, Expires at: {self.expires_at}"
