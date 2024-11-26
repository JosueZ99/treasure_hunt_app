from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.forms import UserCreationForm

# Registro de usuario
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    # Verificar si el usuario ya existe
    if User.objects.filter(username=username).exists():
        return Response({"error": "El nombre de usuario ya está en uso."}, status=status.HTTP_400_BAD_REQUEST)

    # Crear el usuario y guardarlo en la base de datos
    user = User.objects.create_user(username=username, password=password, email=email)
    user.save()

    return Response({"message": "Usuario registrado correctamente."}, status=status.HTTP_201_CREATED)

# Login de usuario con JWT
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Autenticación del usuario
    user = authenticate(username=username, password=password)

    if user is not None:
        # Generar los tokens JWT (RefreshToken y AccessToken)
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'access_token': str(access_token)
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Credenciales incorrectas'
        }, status=status.HTTP_401_UNAUTHORIZED)

