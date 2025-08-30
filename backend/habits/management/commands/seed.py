from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from habits.models import Habit, HabitLog
from datetime import date, timedelta


class Command(BaseCommand):
    help = 'Seed database with sample users, habits, and logs'

    def handle(self, *args, **options):
        User = get_user_model()
        user, _ = User.objects.get_or_create(username='demo', defaults={'email': 'demo@example.com'})
        if not user.has_usable_password():
            user.set_password('password123')
            user.save()

        habits = [
            {'name': 'Drink Water', 'description': '8 glasses daily', 'target_frequency': Habit.DAILY},
            {'name': 'Read Book', 'description': '30 mins reading', 'target_frequency': Habit.DAILY},
            {'name': 'Gym Workout', 'description': '3x per week', 'target_frequency': Habit.WEEKLY},
        ]
        created_habits = []
        for idx, h in enumerate(habits):
            habit, _ = Habit.objects.get_or_create(
                user=user,
                name=h['name'],
                defaults={
                    'description': h['description'],
                    'target_frequency': h['target_frequency'],
                    'start_date': date.today() - timedelta(days=30),
                    'order': idx,
                },
            )
            created_habits.append(habit)

        # Create logs for last 14 days alternating completions
        for habit in created_habits:
            for i in range(14):
                d = date.today() - timedelta(days=i)
                completed = (i % 2 == 0)
                HabitLog.objects.get_or_create(habit=habit, date=d, defaults={'completed': completed})

        self.stdout.write(self.style.SUCCESS('Seed data created: user demo/password123'))


