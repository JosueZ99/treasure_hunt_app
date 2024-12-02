from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import get_leaderboard

urlpatterns = [
    path('login/', views.login_user, name='login'),
    path('register/', views.register_user, name='register'),
    path('user-data/', views.get_user_data, name='user-data'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('leaderboard/', get_leaderboard, name='get_leaderboard'),
    path('scan-qr/', views.scan_qr_code, name='scan_qr_code'),
    path('get_challenge/<uuid:token>/', views.get_challenge, name='get_challenge'),
    path('validate_answer/<uuid:token>/', views.validate_answer, name='validate_answer'),
    path('update_user_progress/<str:token>/', views.update_user_progress, name='update_user_progress'),
    path('get_next_hint/<uuid:token>/', views.get_next_hint, name='get_next_hint'),
]
