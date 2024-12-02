from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import authenticate, login
from api.models import CustomUser, Leaderboard, Location, UserProgress, QRAccessToken, Challenge, Hint, ParticipationHistory
import uuid
from django.utils import timezone
import logging
logger = logging.getLogger(__name__)


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
            'access_token': str(access_token),
            'refresh_token': str(refresh)  # También puedes devolver el token de refresco si lo necesitas
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Credenciales incorrectas'
        }, status=status.HTTP_401_UNAUTHORIZED)

# Obtener datos del usuario
@api_view(['GET'])
@permission_classes([IsAuthenticated])
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_leaderboard(request):
    leaderboard_data = Leaderboard.objects.select_related('user').order_by('-total_points')  # Orden descendente por puntos
    ranking = [
        {
            "rank": idx + 1,
            "name": f"{entry.user.first_name} {entry.user.last_name}",
            "email": entry.user.email,
            "points": entry.total_points,
        }
        for idx, entry in enumerate(leaderboard_data)
    ]
    return Response(ranking, status=status.HTTP_200_OK)

# Escanear código QR
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def scan_qr_code(request):
    user = request.user
    qr_code_value = request.data.get('qr_code')

    try:
        # Buscar la ubicación según el código QR proporcionado
        location = Location.objects.get(qr_code=qr_code_value)

        # Verificar si el usuario ya completó el desafío en esta ubicación
        user_progress, created = UserProgress.objects.get_or_create(user=user, location=location)
        if user_progress.completed:
            return Response({"error": "Ya has completado el desafío para esta ubicación."}, status=status.HTTP_403_FORBIDDEN)

        # Crear un nuevo QRAccessToken válido por un tiempo limitado
        qr_access_token = QRAccessToken.objects.create(
            user=user,
            location=location
        )

        # Actualizar el progreso del usuario (registrar la última ubicación escaneada)
        user_progress.last_scanned_qr = location
        user_progress.save()

        response_data = {
            "message": "QR escaneado con éxito.",
            "location": location.name,
            "token": str(qr_access_token.token),  # Devolver el token para acceder a las pistas y desafíos
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Location.DoesNotExist:
        return Response({"error": "Código QR no válido."}, status=status.HTTP_400_BAD_REQUEST)


# Obtener desafío usando el token
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_challenge(request, token):
    try:
        # Obtener el token y verificar que sea válido
        uuid_token = uuid.UUID(str(token))
        qr_access_token = QRAccessToken.objects.get(token=uuid_token)

        if not qr_access_token.is_valid():
            return Response({"error": "El token ha expirado."}, status=status.HTTP_403_FORBIDDEN)

        # Obtener el progreso del usuario para la ubicación del token
        user_progress = UserProgress.objects.filter(user=request.user, location=qr_access_token.location).first()

        if user_progress and user_progress.completed:
            return Response({"message": "Este desafío ya ha sido completado."}, status=status.HTTP_403_FORBIDDEN)

        # Obtener el challenge asociado a la ubicación
        challenge = Challenge.objects.filter(location=qr_access_token.location).first()

        if challenge:
            response_data = {
                "question": challenge.question,
                "points": challenge.points,
                "options": challenge.options,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No hay desafíos disponibles para esta ubicación."}, status=status.HTTP_404_NOT_FOUND)

    except QRAccessToken.DoesNotExist:
        return Response({"error": "Token inválido."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error inesperado al obtener el desafío con el token: %s", token)
        return Response({"error": f"Error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_answer(request, token):
    try:
        # Obtener el token y verificar que sea válido
        uuid_token = uuid.UUID(str(token))
        qr_access_token = QRAccessToken.objects.get(token=uuid_token)

        if not qr_access_token.is_valid():
            return Response({"error": "El token ha expirado."}, status=status.HTTP_403_FORBIDDEN)

        # Verificar si el usuario ya completó este desafío
        user_progress = UserProgress.objects.filter(user=request.user, location=qr_access_token.location).first()

        if user_progress and user_progress.completed:
            return Response({"message": "Este desafío ya ha sido completado."}, status=status.HTTP_403_FORBIDDEN)

        # Obtener el desafío asociado
        challenge = Challenge.objects.filter(location=qr_access_token.location).first()

        # Validar la respuesta
        answer = request.data.get('answer')
        if challenge and answer:
            if challenge.correct_answer.lower() == answer.lower():
                # Marcar el desafío como completado
                user_progress.completed = True
                user_progress.completed_at = timezone.now()
                user_progress.points_earned += challenge.points
                user_progress.save()

                response_data = {
                    "message": "Respuesta correcta.",
                    "points": challenge.points,
                    "correct": True,
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                response_data = {
                    "message": "Respuesta incorrecta.",
                    "correct": False,
                }
                return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No se encontró el desafío o la respuesta no es válida."}, status=status.HTTP_404_NOT_FOUND)

    except QRAccessToken.DoesNotExist:
        return Response({"error": "Token inválido."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_progress(request, token):
    try:
        # Obtener el token y verificar que sea válido
        qr_access_token = QRAccessToken.objects.get(token=uuid.UUID(token))

        if not qr_access_token.is_valid():
            return Response({"error": "El token ha expirado."}, status=status.HTTP_403_FORBIDDEN)

        user = request.user
        location = qr_access_token.location

        # Obtener el challenge asociado a la ubicación
        challenge = Challenge.objects.filter(location=location).first()

        if not challenge:
            return Response({"error": "No hay desafíos disponibles para esta ubicación."}, status=status.HTTP_404_NOT_FOUND)

        # Obtener o crear el progreso del usuario en la ubicación
        user_progress, created = UserProgress.objects.get_or_create(user=user, location=location)

        if not created:
            # Si el progreso ya existía, simplemente incrementamos los puntos y marcamos como completado
            user_progress.points_earned += challenge.points
            user_progress.completed = True
            user_progress.save()
        else:
            # Si es la primera vez que se registra el progreso en esta ubicación
            user_progress.points_earned = challenge.points
            user_progress.completed = True
            user_progress.last_scanned_qr = location
            user_progress.save()

        # Actualizar el leaderboard
        leaderboard, _ = Leaderboard.objects.get_or_create(user=user)
        leaderboard.total_points += challenge.points
        leaderboard.save()

        # Registrar en el historial de participación
        ParticipationHistory.objects.create(
            user=user,
            location=location,
            action='Completó el desafío'
        )

        return Response({"message": "Progreso del usuario actualizado con éxito."}, status=status.HTTP_200_OK)

    except QRAccessToken.DoesNotExist:
        return Response({"error": "Token inválido."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log para ayudar con la depuración
        return Response({"error": "Error inesperado. Inténtalo más tarde."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Obtener la siguiente pista
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_next_hint(request, token):
    try:
        # Convertir el token a UUID
        try:
            uuid_token = uuid.UUID(str(token))  # Convertimos a string para evitar problemas con valores inesperados
        except ValueError:
            logger.error("Token inválido: %s", token)
            return Response({"error": "Token inválido."}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar que el token exista y sea válido
        try:
            qr_access_token = QRAccessToken.objects.get(token=uuid_token)
        except QRAccessToken.DoesNotExist:
            logger.error("Token no encontrado: %s", uuid_token)
            return Response({"error": "Token no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if not qr_access_token.is_valid():
            logger.error("Token expirado: %s", uuid_token)
            return Response({"error": "El token ha expirado."}, status=status.HTTP_403_FORBIDDEN)

        # Obtener el progreso del usuario en la ubicación actual
        user = request.user
        location = qr_access_token.location

        try:
            user_progress = UserProgress.objects.get(user=user, location=location)
        except UserProgress.DoesNotExist:
            logger.error("No se encontró progreso para el usuario: %s en la ubicación: %s", user.email, location.name)
            return Response({"error": "No se encontró progreso."}, status=status.HTTP_404_NOT_FOUND)

        # Obtener la siguiente pista según el progreso actual
        current_hint_number = user_progress.current_hint
        next_hint = Hint.objects.filter(location=location, order=current_hint_number).first()

        if next_hint:
            # Actualizar el progreso del usuario al siguiente número de pista
            user_progress.current_hint += 1
            user_progress.save()

            response_data = {
                "hint": next_hint.text
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Si no hay más pistas disponibles
            logger.info("No hay más pistas disponibles para la ubicación: %s", location.name)
            return Response({"message": "No hay más pistas disponibles para esta ubicación."}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception("Error inesperado al obtener la siguiente pista con el token: %s", token)
        return Response({"error": "Error inesperado. Inténtalo más tarde."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
