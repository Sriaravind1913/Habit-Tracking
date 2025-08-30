from django.contrib import admin
from .models import Habit, HabitLog


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'target_frequency', 'start_date', 'order', 'created_at')
    list_filter = ('target_frequency', 'start_date', 'created_at')
    search_fields = ('name', 'description', 'user__username', 'user__email')


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'habit', 'date', 'completed', 'created_at')
    list_filter = ('completed', 'date')
    search_fields = ('habit__name',)


# Register your models here.
