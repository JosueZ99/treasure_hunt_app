from django.contrib import admin
from .models import CustomUser, Location, Challenge, Hint, UserProgress, Leaderboard, ParticipationHistory

admin.site.register(CustomUser)
admin.site.register(Location)
admin.site.register(Challenge)
admin.site.register(Hint)
admin.site.register(UserProgress)
admin.site.register(Leaderboard)
admin.site.register(ParticipationHistory)
