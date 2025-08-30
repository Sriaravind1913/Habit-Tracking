from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HabitViewSet, DashboardView, RegisterView, HabitNoteView, ExportCSVView, ExportJSONView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'habits', HabitViewSet, basename='habit')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('habits/<int:habit_id>/notes/', HabitNoteView.as_view(), name='habit-notes'),
    path('export/csv/', ExportCSVView.as_view(), name='export-csv'),
    path('export/json/', ExportJSONView.as_view(), name='export-json'),
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]


