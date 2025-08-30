from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Habit, HabitLog, HabitNote
from .serializers import HabitSerializer, HabitLogSerializer, UserSerializer, HabitNoteSerializer
from datetime import date, timedelta
import csv
from django.http import HttpResponse, JsonResponse


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user).order_by('order', '-created_at')

    @action(detail=True, methods=['get', 'post'], url_path='logs')
    def logs(self, request, pk=None):
        habit = self.get_object()
        if request.method.lower() == 'get':
            logs = habit.logs.all()
            return Response(HabitLogSerializer(logs, many=True).data)
        # POST: create new log, prevent duplicate per date
        serializer = HabitLogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        log_date = serializer.validated_data['date']
        completed = serializer.validated_data.get('completed', True)
        log, created = HabitLog.objects.get_or_create(habit=habit, date=log_date, defaults={'completed': completed})
        if not created:
            log.completed = completed
            log.save()
        return Response(HabitLogSerializer(log).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='reorder')
    def reorder(self, request):
        # Expect payload: { order: [{id: number, order: number}, ...] }
        items = request.data.get('order', [])
        user_habits = {h.id: h for h in Habit.objects.filter(user=request.user)}
        for item in items:
            habit_id = item.get('id')
            order_value = item.get('order', 0)
            habit = user_habits.get(habit_id)
            if habit:
                habit.order = order_value
                habit.save(update_fields=['order'])
        return Response({'status': 'ok'})


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        habits = Habit.objects.filter(user=user, archived=False)
        total_habits = habits.count()

        # Compute current streaks and completion rate (last 30 days)
        today = date.today()
        period_start = today - timedelta(days=29)
        logs = HabitLog.objects.filter(habit__in=habits, date__gte=period_start, date__lte=today)

        # Completion percentage: completed logs / expected occurrences
        completed_count = logs.filter(completed=True).count()
        # expected occurrences: daily = 30 per habit, weekly ~ 5 per habit
        expected = 0
        for habit in habits:
            if habit.target_frequency == Habit.DAILY:
                expected += 30
            elif habit.target_frequency == Habit.WEEKLY:
                expected += 5
            else:
                expected += 1
        completion_rate = round((completed_count / expected) * 100, 2) if expected else 0.0

        # Best streak per habit (consecutive days completed)
        best_streak = 0
        for habit in habits:
            habit_logs = {l.date: l.completed for l in HabitLog.objects.filter(habit=habit, date__lte=today)}
            current = 0
            max_streak = 0
            check_days = 30 if habit.target_frequency == Habit.DAILY else 60
            for i in range(check_days):
                d = today - timedelta(days=i)
                done = habit_logs.get(d, False)
                if done:
                    current += 1
                    max_streak = max(max_streak, current)
                else:
                    current = 0
            best_streak = max(best_streak, max_streak)

        data = {
            'total_habits': total_habits,
            'completion_rate': completion_rate,
            'best_streak': best_streak,
        }
        return Response(data)


class HabitNoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, habit_id):
        habit = Habit.objects.get(id=habit_id, user=request.user)
        notes = HabitNote.objects.filter(habit=habit).order_by('-date')
        return Response(HabitNoteSerializer(notes, many=True).data)

    def post(self, request, habit_id):
        habit = Habit.objects.get(id=habit_id, user=request.user)
        serializer = HabitNoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note, _ = HabitNote.objects.update_or_create(
            habit=habit,
            date=serializer.validated_data['date'],
            defaults={'content': serializer.validated_data.get('content', '')}
        )
        return Response(HabitNoteSerializer(note).data, status=201)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email', '')
        password = request.data.get('password')
        if not username or not password:
            return Response({'detail': 'username and password required'}, status=400)
        User = get_user_model()
        if User.objects.filter(username=username).exists():
            return Response({'detail': 'username already exists'}, status=400)
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response(UserSerializer(user).data, status=201)


class ExportCSVView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        habits = Habit.objects.filter(user=request.user)
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="habits_export.csv"'
        writer = csv.writer(response)
        writer.writerow(['habit_id', 'name', 'description', 'target_frequency', 'start_date', 'archived', 'goal_type', 'goal_target', 'log_date', 'completed'])
        logs = HabitLog.objects.filter(habit__in=habits).select_related('habit').order_by('habit_id', 'date')
        for log in logs:
            h = log.habit
            writer.writerow([h.id, h.name, h.description, h.target_frequency, h.start_date, h.archived, h.goal_type, h.goal_target, log.date, log.completed])
        return response


class ExportJSONView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        habits = Habit.objects.filter(user=request.user)
        payload = []
        for h in habits:
            item = {
                'id': h.id,
                'name': h.name,
                'description': h.description,
                'target_frequency': h.target_frequency,
                'start_date': h.start_date.isoformat(),
                'archived': h.archived,
                'goal_type': h.goal_type,
                'goal_target': h.goal_target,
                'logs': [
                    { 'date': l.date.isoformat(), 'completed': l.completed }
                    for l in HabitLog.objects.filter(habit=h).order_by('date')
                ],
            }
            payload.append(item)
        return JsonResponse(payload, safe=False)


# Create your views here.
