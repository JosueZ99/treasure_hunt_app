from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from api.models import CustomUser, Leaderboard

# Registro de usuario
@api_view(['POST'])
def register_user(request):
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validar que los campos obligatorios estén presentes
    if not email or not first_name or not last_name or not password:
        return Response({"error": "Todos los campos son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar si el email ya está en uso
    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "El correo electrónico ya está en uso."}, status=status.HTTP_400_BAD_REQUEST)

    # Crear el usuario y guardarlo en la base de datos
    user = CustomUser.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
    user.save()

    return Response({"message": "Usuario registrado correctamente."}, status=status.HTTP_201_CREATED)

# Login de usuario con JWTs
@api_view(['POST'])
def login_user(request):
    email = request.data.get('email').lower()  # Usamos email para autenticar
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password)  # Autenticación por email

    if user is not None:
        login(request, user)

        # Generar un token JWT para la autenticación futura
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'access_token': str(access_token)
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Credenciales incorrectas'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_user_data(request):
    user = request.user  # Obtenemos el usuario autenticado

    if user.is_authenticated:
        # Asegúrate de que first_name y last_name existan, con valores predeterminados si están vacíos
        first_name = user.first_name if user.first_name else "Nombre"
        last_name = user.last_name if user.last_name else "Apellido"

        # Verificar si el usuario tiene un registro en Leaderboard
        leaderboard = Leaderboard.objects.filter(user=user).first()
        points = leaderboard.total_points if leaderboard else 0

        return Response({
            "name": f"{first_name} {last_name}",
            "points": points,
        })
    return Response({"error": "No autenticado"}, status=401)