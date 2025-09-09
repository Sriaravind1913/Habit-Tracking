from django.db import models
from django.contrib.auth import get_user_model


class Habit(models.Model):
    DAILY = 'daily'
    WEEKLY = 'weekly'
    MONTHLY = 'monthly'
    FREQUENCY_CHOICES = [
        (DAILY, 'Daily'),
        (WEEKLY, 'Weekly'),
        (MONTHLY, 'Monthly'),
    ]

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, default=DAILY)
    start_date = models.DateField()
    order = models.PositiveIntegerField(default=0)
    archived = models.BooleanField(default=False)
    goal_type = models.CharField(max_length=10, choices=[('weekly', 'Weekly'), ('monthly', 'Monthly')], default='weekly')
    goal_target = models.PositiveIntegerField(default=5)
    # Optional daily reminder time in 24h format
    reminder_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self) -> str:
        return f"{self.name} ({self.user})"


class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    completed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('habit', 'date')
        ordering = ['-date', '-created_at']

    def __str__(self) -> str:
        return f"{self.habit.name} - {self.date} - {'✔' if self.completed else '✘'}"


class HabitNote(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='notes')
    date = models.DateField()
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('habit', 'date')
        ordering = ['-date', '-created_at']

    def __str__(self) -> str:
        return f"Note {self.habit.name} - {self.date}"


# Create your models here.
